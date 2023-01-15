import React, { useRef, useEffect } from "react";
import Sketch from "react-p5";
import p5Collide2dInit from "../plugins/p5.collide2d.init";
import PlayerChar from "../customs/PlayerChar";
import { predictCollision, detectCollision } from "../customs/CollisionDetection";

export default function GdGameCanvasP5(props) {
  const { mapData, pCharData, BASE_WIDTH, BASE_HEIGHT, BLOCK_UNIT } = props;

  const pCharRef = useRef(new PlayerChar({
    x: pCharData.x, // in ppu
    y: pCharData.y, // in ppu
    rad: 0, // in rad
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
        neighbors.push(entity);
      } else if (entity.shape === "tri") {
        p5.triangle(
          entity.x1 * ppu,
          entity.y1 * ppu,
          entity.x2 * ppu,
          entity.y2 * ppu,
          entity.x3 * ppu,
          entity.y3 * ppu
        );
        neighbors.push(entity);
      }
    }
    // end of map

    // detect collision
    // const result = detectCollision({ ppu, p5, pChar: pCharRef.current, neighbors });
    const result = {};
    // console.log(pCharRef.current);
    // end of detect collision

    // player character drawing
    p5.strokeWeight(0);
    if (result.die) {
      p5.fill("red");
    } else {
      p5.fill("green");
    }
    p5.quad(...pCharRef.current.getVerticesPpu().map(p => p * ppu));
    // end of player character drawing
    
    // key event handling
    if (p5.keyIsDown(83)) {
      // console.log(neighbors);
      console.log(pCharRef.current.getVerticesPpu());
      console.log(pCharRef.current.getPlayerCharStatesSet({ ppu, p5, neighbors }));
    }
    if (p5.keyIsDown(p5.UP_ARROW)) {
      console.log("w");
      const displaceX = 0;
      const displaceY = -1;
      pCharRef.current.y += displaceY;
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
      console.log("s");
      const displaceX = 0;
      const displaceY = 1;
      pCharRef.current.y += displaceY;
    } else if (p5.keyIsDown(p5.LEFT_ARROW)) {
      console.log("a");
      const displaceX = -1;
      const displaceY = 0;
      pCharRef.current.x += displaceX;
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      console.log("s");
      const displaceX = 1;
      const displaceY = 0;
      pCharRef.current.x += displaceX;
    }
    // end of key event handling
  };

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
