import { detectCollision, detectContact } from "./CollisionDetection";
import PlayerCharDie from "./PlayerCharStates/PlayerCharDie";
import PlayerCharOnGroundStable from "./PlayerCharStates/PlayerCharOnGroundStable";
import PlayerCharOnGroundUnstable from "./PlayerCharStates/PlayerCharOnGroundUnstable";
import PlayerCharFallFromGround from "./PlayerCharStates/PlayerCharFallFromGround";

function getEntityCenter(entity) {
  if (entity.shape === "rect") {
    return [entity.x + entity.width * 0.5, entity.y + entity.height * 0.5];
  } else if (entity.shape === "tri") {
    // centroid
    return [
      (entity.x1 + entity.x2 + entity.x3) / 3,
      (entity.y1 + entity.y2 + entity.y3) / 3,
    ];
  }
  throw new Error("unknown entity shape");
}

function getVerticesAboveYLevel(vertices, y) {
  const filteredVertices = [];
  for (let i = 1; i <= 7; i += 2) {
    if (vertices[i] < y) {
      // since y is inverted in canvas coordinate
      filteredVertices.push([vertices[i - 1], vertices[i]]);
    }
  }
  return filteredVertices;
}

export default class PlayerChar {
  constructor({ x, y, rad, width }) {
    this.x = x; // in ppu
    this.y = y; // in ppu
    this.rad = rad; // rotation about center, in radian, when 0 the block is parallel to horizontal axis
    this.width = width; // in ppu
    this.contactThreshold = 1; // threshold for determining pChar contacting entites, in ppu
    this.allStates = Object.freeze({
      Die: PlayerCharDie,
      OnGroundStabe: PlayerCharOnGroundStable,
      OnGroundUnstable: PlayerCharOnGroundUnstable,
      FallFromGround: PlayerCharFallFromGround,
    });
  }

  isParallel() { // return boolean of whether the block is parallel to horizontal axis
    return (this.rad % (Math.PI * 0.5) < 0.01 || this.rad % (Math.PI * 0.5) - (Math.PI * 0.5) < 0.01);
  }

  getVerticesPpu(displaceX = 0, displaceY = 0) {
    // get vertices in ppu
    const halfDiagonal = this.width * 2 ** -0.5;
    return [
      this.x + displaceX + halfDiagonal * Math.cos(this.rad + Math.PI * 0.25),
      this.y + displaceY + halfDiagonal * Math.sin(this.rad + Math.PI * 0.25), // radian anticlockwise in cartisian coordinate = clockwise in canvas
      this.x + displaceX + halfDiagonal * Math.cos(this.rad + Math.PI * 0.75),
      this.y + displaceY + halfDiagonal * Math.sin(this.rad + Math.PI * 0.75), // radian anticlockwise in cartisian coordinate = clockwise in canvas
      this.x + displaceX + halfDiagonal * Math.cos(this.rad + Math.PI * 1.25),
      this.y + displaceY + halfDiagonal * Math.sin(this.rad + Math.PI * 1.25), // radian anticlockwise in cartisian coordinate = clockwise in canvas
      this.x + displaceX + halfDiagonal * Math.cos(this.rad + Math.PI * 1.75),
      this.y + displaceY + halfDiagonal * Math.sin(this.rad + Math.PI * 1.75), // radian anticlockwise in cartisian coordinate = clockwise in canvas
    ];
  }

  getPlayerCharStatesSet({ ppu, p5, neighbors }) {
    const nonPenetrableNeigbors = neighbors.filter((n) => !n.penetrable);

    const nonPenetrableNeigborsContactResult = detectContact({
      ppu,
      p5,
      pChar: this,
      entities: nonPenetrableNeigbors,
      contactThreshold: this.contactThreshold,
    });

    const penetrableNeigbors = neighbors.filter(n => n.penetrable);
    
    const penetrableNeigborsContactResult = detectContact({
      ppu,
      p5,
      pChar: this,
      entities: penetrableNeigbors,
      contactThreshold: this.contactThreshold,
    });

    const states = new Set();
    if (penetrableNeigborsContactResult.contacts.length) {
      for (let contact of penetrableNeigborsContactResult.contacts) {
        const entity = contact.entity;
        if (entity.type === "die") {
          states.add(this.allStates.Die);
        }
      }
    }
    if (nonPenetrableNeigborsContactResult.contacts.length) {
      for (let contact of nonPenetrableNeigborsContactResult.contacts) {
        const entity = contact.entity;
        console.log(entity);
        console.log(getVerticesAboveYLevel(this.getVerticesPpu(), entity.y));
        if (
          entity.shape === "rect" &&
          entity.y + entity.height < this.y &&
          getVerticesAboveYLevel(this.getVerticesPpu(), entity.y + entity.height).length > 0
        ) {
          // center of pChar are below entity but not all 4 vertices below entity
          states.add(this.allStates.Die);
        }

        if (
          entity.shape === "rect" &&
          entity.y > this.y &&
          getVerticesAboveYLevel(this.getVerticesPpu(), entity.y).length < 4 && 
          entity.x + entity.width >= this.x 
        ) {
          // center of pChar are above entity but not all 4 vertices above entity, also pChar center is not more forward than ground edge
          states.add(this.allStates.Die); // TODO: this should be changed to ClimbGround after code for PlayerCharClimbGround class
        }

        if (
          entity.shape === "rect" &&
          getVerticesAboveYLevel(this.getVerticesPpu(), entity.y).length === 4 && 
          entity.x + entity.width >= this.x 
        ) {
          // pChar is entirely on top of entity, also pChar center is not more forward than ground edge
          if (this.isParallel()) {
            states.add(this.allStates.OnGroundStabe);
          } else {
            states.add(this.allStates.OnGroundUnstable);
          }
        }

        if (
          entity.shape === "rect" &&
          entity.y > this.y &&
          entity.x + entity.width < this.x 
        ) {
          // pChar center is above ground and is more forward than the edge of ground
          states.add(this.allStates.FallFromGround);
        }
      }
    }

    return states;
  }
}
