import React, { useRef, useEffect } from "react";
import Sketch from "react-p5";
import p5Collide2dInit from "../plugins/p5.collide2d.init";
import PlayerCharState from "../customs/PlayerCharStates/PlayerCharState";
import PlayerChar from "../customs/PlayerChar";

export default function GdGameCanvasP5(props) {
  const { mapData, pCharData, BASE_WIDTH, BASE_HEIGHT, BLOCK_UNIT } = props;

  const pChar = useRef(new PlayerChar({
    x: pCharData.x, // in ppu
    y: pCharData.y, // in ppu
    rad: Math.PI / 4, // in rad
    width: pCharData.blockWidth * BLOCK_UNIT, // in block unit
  }));

  // map entities init
  let mapEntities = mapData.entities;

  // TODO: filter entities that are in range of canvas

  let neighbors;

  let ppu = 1; // pixels per unit

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    updatePpu();
    p5.createCanvas(BASE_WIDTH * ppu, BASE_HEIGHT * ppu).parent(
      canvasParentRef
    );
    p5Collide2dInit(p5);
  };

  const draw = (p5) => {
    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
    updatePpu();
    fitCanvas(p5);

    //

    //

    p5.background("#555");

    // TODO: only render map entities that are in range of canvas
    // map
    neighbors = [];
    p5.strokeWeight(1);
    p5.stroke("#999");
    p5.fill("#fff");
    for (let i = 0; i < mapEntities.length; i++) {
      const entity = mapEntities[i];
      if (entity.shape === "rect") {
        p5.rect(
          entity.x * ppu,
          entity.y * ppu,
          entity.width * ppu,
          entity.height * ppu
        );
        neighbors.push({
          shape: entity.shape,
          type: entity.type,
          // everything in exact pixels
          x: entity.x * ppu,
          y: entity.y * ppu,
          width: entity.width * ppu,
          height: entity.height * ppu,
        });
      } else if (entity.shape === "tri") {
        p5.triangle(
          entity.x1 * ppu,
          entity.y1 * ppu,
          entity.x2 * ppu,
          entity.y2 * ppu,
          entity.x3 * ppu,
          entity.y3 * ppu
        );
        neighbors.push({
          shape: entity.shape,
          type: entity.type,
          // everything in exact pixels
          x1: entity.x1 * ppu,
          y1: entity.y1 * ppu,
          x2: entity.x2 * ppu,
          y2: entity.y2 * ppu,
          x3: entity.x3 * ppu,
          y3: entity.y3 * ppu,
        });
      }
    }
    // end of map

    // detect collision
    const result = detectCollision({ p5, pChar, neighbors });
    // end of detect collision

    // player character drawing
    p5.strokeWeight(0);
    if (result.die) {
      p5.fill("red");
    } else {
      p5.fill("green");
    }
    // p5.rect(
    //   pChar.current.x * ppu,
    //   pChar.current.y * ppu,
    //   pChar.current.blockWidth * ppb,
    //   pChar.current.blockHeight * ppb
    // );
    // p5.quad(pChar.current.x, pChar.current.y, 86, 20, 69, 63, 30, 76);
    p5.quad(...pChar.current.getVerticesPpu().map(p => p * ppu));
    // end of player character drawing

    // key event handling
    if (p5.keyIsDown(p5.UP_ARROW)) {
      console.log("w");
      const displaceX = 0;
      const displaceY = -1;
      const willCollide = predictCollision({
        p5,
        pChar,
        neighbors,
        displaceX,
        displaceY,
      });
      if (!willCollide) pChar.current.y += displaceY;
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
      console.log("s");
      const displaceX = 0;
      const displaceY = 1;
      const willCollide = predictCollision({
        p5,
        pChar,
        neighbors,
        displaceX,
        displaceY,
      });
      if (!willCollide) pChar.current.y += displaceY;
    } else if (p5.keyIsDown(p5.LEFT_ARROW)) {
      console.log("a");
      const displaceX = -1;
      const displaceY = 0;
      const willCollide = predictCollision({
        p5,
        pChar,
        neighbors,
        displaceX,
        displaceY,
      });
      if (!willCollide) pChar.current.x += displaceX;
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      console.log("s");
      const displaceX = 1;
      const displaceY = 0;
      const willCollide = predictCollision({
        p5,
        pChar,
        neighbors,
        displaceX,
        displaceY,
      });
      if (!willCollide) pChar.current.x += displaceX;
    }
    // end of key event handling
  };

  function predictCollision({ p5, pChar, neighbors, displaceX, displaceY }) {
    let willCollide = false;
    for (let i in neighbors) {
      const entity = neighbors[i];
      const pCharVertices = pChar.current.getVerticesPpu(displaceX, displaceY);
      if (entity.shape === "rect") {
        // willCollide = p5.collideRectRect(
        //   (pChar.current.x + displaceX) * ppu,
        //   (pChar.current.y + displaceY) * ppu,
        //   pChar.current.width * ppu,
        //   pChar.current.width * ppu,
        //   entity.x,
        //   entity.y,
        //   entity.width,
        //   entity.height
        // );
        willCollide = p5.collideRectPoly(
          entity.x,
          entity.y,
          entity.width,
          entity.height,
          [
            p5.createVector(pCharVertices[0] * ppu, pCharVertices[1] * ppu),
            p5.createVector(pCharVertices[2] * ppu, pCharVertices[3] * ppu),
            p5.createVector(pCharVertices[4] * ppu, pCharVertices[5] * ppu),
            p5.createVector(pCharVertices[6] * ppu, pCharVertices[7] * ppu),
          ]
        );

        if (willCollide) {
          break;
        }
      }
    }
    return willCollide;
  }

  function detectCollision({ p5, pChar, neighbors }) {
    const result = {die: false, collisions : []};
    const pCharVertices = pChar.current.getVerticesPpu();
    for (let i in neighbors) {
      let collided = false;
      const entity = neighbors[i];
      if (entity.shape === "rect") {
        collided = p5.collideRectPoly(
          entity.x,
          entity.y,
          entity.width,
          entity.height,
          [
            p5.createVector(pCharVertices[0] * ppu, pCharVertices[1] * ppu),
            p5.createVector(pCharVertices[2] * ppu, pCharVertices[3] * ppu),
            p5.createVector(pCharVertices[4] * ppu, pCharVertices[5] * ppu),
            p5.createVector(pCharVertices[6] * ppu, pCharVertices[7] * ppu),
          ]
        );
      } else if (entity.shape === "tri") {
        collided = p5.collidePolyPoly(
          [
            p5.createVector(pCharVertices[0] * ppu, pCharVertices[1] * ppu),
            p5.createVector(pCharVertices[2] * ppu, pCharVertices[3] * ppu),
            p5.createVector(pCharVertices[4] * ppu, pCharVertices[5] * ppu),
            p5.createVector(pCharVertices[6] * ppu, pCharVertices[7] * ppu),
          ],
          [
            p5.createVector(entity.x1, entity.y1),
            p5.createVector(entity.x2, entity.y2),
            p5.createVector(entity.x3, entity.y3),
          ],
          true
        );
      }

      if (collided) {
        if (entity.type === 'die') {
          result.die = true;
        }
        result.collisions.push({entity});
      }
    }
    return result;
  }

  const windowResized = (p5) => {
    updatePpu();
    fitCanvas(p5);
  };

  const keyPressed = (p5) => {};

  function fitCanvas(p5) {
    p5.resizeCanvas(BASE_WIDTH * ppu, BASE_HEIGHT * ppu);
  }

  function updatePpu() {
    ppu = Math.min(
      (window.innerWidth - 60) / BASE_WIDTH,
      (window.innerHeight - 200) / BASE_HEIGHT
    );
  }

  return (
    <div className="gd-game-canvas-container">
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        keyPressed={keyPressed}
      />
    </div>
  );
}
