import { detectCollision, detectContact } from "./CollisionDetection";
import PlayerCharDie from "./PlayerCharStates/PlayerCharDie";
import PlayerCharOnGroundStable from "./PlayerCharStates/PlayerCharOnGroundStable";
import PlayerCharOnGroundUnstable from "./PlayerCharStates/PlayerCharOnGroundUnstable";
import PlayerCharFallFromGround from "./PlayerCharStates/PlayerCharFallFromGround";
import PlayerCharFreeFall from "./PlayerCharStates/PlayerCharFreeFall";

function getEntityCenter(entity) {
  if (entity.shape.alias === "rect") {
    return [entity.x + entity.width * 0.5, entity.y + entity.height * 0.5];
  } else if (entity.shape.alias === "tri") {
    // centroid
    return [
      (entity.x1 + entity.x2 + entity.x3) / 3,
      (entity.y1 + entity.y2 + entity.y3) / 3,
    ];
  }
  throw new Error("unknown entity shape.alias");
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
  constructor({ x, y, rad, width, vX, vY, vRad, aX, aY, aRad }) {
    // vX, vY, vRad, aX, aY, aRad are optional
    this.x = x; // in ppu
    this.y = y; // in ppu
    this.rad = rad; // rotation about center, in radian, when 0 the block is parallel to horizontal axis
    this.vX = vX || 0; // horizontal velocity (right positive) in ppu per sec
    this.vY = vY || 0; // vertical velocity (downward postive) in ppu per sec
    this.vRad = vRad || 0; // angular velocity (clockwise positive) in ppu per sec
    this.aX = aX || 0; // horizontal acceleration (right positive) in ppu per sec square
    this.aY = aY || 0; // vertical acceleration (downward postive) in ppu per sec squre
    this.aRad = aRad || 0; // angular velocity (clockwise positive) in ppu per sec squre
    this.width = width; // in ppu
    this.contactThreshold = 1; // threshold for determining pChar contacting entites, in ppu
    this.allStates = Object.freeze({
      FreeFall: PlayerCharFreeFall,
      Die: PlayerCharDie,
      OnGroundStabe: PlayerCharOnGroundStable,
      OnGroundUnstable: PlayerCharOnGroundUnstable,
      FallFromGround: PlayerCharFallFromGround,
    });
  }

  isParallel() {
    // return boolean of whether the block is parallel to horizontal axis
    return (
      (this.rad % (Math.PI * 0.5) >= 0 && this.rad % (Math.PI * 0.5) < 0.01) ||
      ((this.rad % (Math.PI * 0.5)) - Math.PI * 0.5 >= 0 &&
        (this.rad % (Math.PI * 0.5)) - Math.PI * 0.5 < 0.01)
    );
  }

  getHalfDiagonal() {
    return this.width * 2 ** -0.5
  }

  getVerticesPpu(displaceX = 0, displaceY = 0) {
    // get vertices in ppu
    const halfDiagonal = this.getHalfDiagonal();
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

  getPlayerCharStatesSet({ p5, neighbors }) {
    const nonPenetrableNeigbors = neighbors.filter((n) => !n.penetrable);

    const nonPenetrableNeigborsContactResult = this.getContactReport({ p5, entities: nonPenetrableNeigbors });

    const penetrableNeigbors = neighbors.filter((n) => n.penetrable);

    const penetrableNeigborsContactResult = this.getContactReport({ p5, entities: penetrableNeigbors });

    const states = new Set();

    if (
      nonPenetrableNeigborsContactResult.contacts.length === 0 &&
      penetrableNeigborsContactResult.contacts.length === 0
    ) {
      states.add(this.allStates.FreeFall);
      return states;
    }
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
        if (
          entity.shape.alias === "rect" &&
          entity.y + entity.height < this.y &&
          getVerticesAboveYLevel(
            this.getVerticesPpu(),
            entity.y + entity.height
          ).length > 0
        ) {
          // center of pChar are below entity but not all 4 vertices below entity
          states.add(this.allStates.Die);
        }

        if (
          entity.shape.alias === "rect" &&
          entity.y > this.y &&
          getVerticesAboveYLevel(this.getVerticesPpu(), entity.y).length < 4 &&
          entity.x + entity.width >= this.x
        ) {
          // center of pChar are above entity but not all 4 vertices above entity, also pChar center is not more forward than ground edge
          states.add(this.allStates.Die); // TODO: this should be changed to ClimbGround after code for PlayerCharClimbGround class
        }

        if (
          entity.shape.alias === "rect" &&
          getVerticesAboveYLevel(this.getVerticesPpu(), entity.y).length ===
            4 &&
          !this.isParallel()
        ) {
          states.add(this.allStates.OnGroundUnstable);
        }

        if (
          entity.shape.alias === "rect" &&
          getVerticesAboveYLevel(this.getVerticesPpu(), entity.y).length ===
            4 &&
          this.isParallel() &&
          entity.x + entity.width >= this.x
        ) {
          // pChar is entirely on top of entity, also pChar center is not more forward than ground edge
          states.add(this.allStates.OnGroundStabe);
        }

        if (
          entity.shape.alias === "rect" &&
          entity.x + entity.width < this.x
        ) {
          // pChar center is above ground and is more forward than the edge of ground
          states.add(this.allStates.FallFromGround);
        }
      }
    }

    return states;
  }

  getPlayerCharState({ p5, neighbors }) {
    const states = this.getPlayerCharStatesSet({ p5, neighbors });

    if (states.size === 0) {
      // return PlayerCharState;
      console.error("empty state set");
      throw new Error("empty state set");
    }

    if (states.has(this.allStates.Die)) {
      return this.allStates.Die;
    } else if (states.has(this.allStates.OnGroundStabe)) {
      return this.allStates.OnGroundStabe;
    } else if (states.has(this.allStates.OnGroundUnstable)) {
      return this.allStates.OnGroundUnstable;
    } else if (states.has(this.allStates.FallFromGround)) {
      return this.allStates.FallFromGround;
    } else if (states.has(this.allStates.FreeFall)) {
      return this.allStates.FreeFall;
    } else {
      console.error("unknown handled state");
      throw new Error("unknown handled state");
    }
  }

  getAngleOfElevation() {
    // angle of elevation of the player character surface on the right side, i.e. included angle between that surface and horizontal ground
    let angle = - this.rad % (Math.PI * 0.5);
    return (angle >= 0) ? angle : angle + Math.PI * 0.5;
  }

  getLowestVertice() {
    const flattenVertices = this.getVerticesPpu();
    const vertices = [];
    for (let i = 0; i < flattenVertices.length; i += 2) {
        vertices.push([flattenVertices[i], flattenVertices[i + 1]]);
    }
    return vertices.reduce((v, acc) => {
        return (v[1] > acc[1]) ? v : acc;
    });
  }

  getCollisionReport({ p5, entities, displaceX, displaceY }) {
    return detectCollision({ p5, pChar: this, entities, displaceX, displaceY });
  }

  getContactReport({ p5, entities }) {
    return detectContact({ p5, pChar: this, entities, contactThreshold: this.contactThreshold });
  }
}
