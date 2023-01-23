import React, { useRef, useEffect } from "react";
import Sketch from "react-p5";
import p5Collide2dInit from "../plugins/p5.collide2d.init";
import PlayerChar from "../customs/PlayerChar";

export default function GdGameCanvasP5(props) {
  const { mapData, pCharData, BASE_WIDTH, BASE_HEIGHT, BLOCK_UNIT } = props;
  const FRAME_RATE = 60; // frames per second
  const FRAME_DURATION = 1 / FRAME_RATE; // second

  const pCharRef = useRef(
    new PlayerChar({
      x: pCharData.x, // in ppu
      y: pCharData.y, // in ppu
      rad: 0, // in rad
      width: pCharData.blockWidth * BLOCK_UNIT, // in block unit
      // optional parameters
      vX: 300,
      // end of optional parameters
    })
  );

  // coordinates of top left corner of FOV
  const fovRef = useRef({
    coordinates: [0, 0],
    WIDTH: BASE_WIDTH,
    HEIGHT: BASE_HEIGHT,
    getLeftBoundary: function () {
      return this.coordinates[0];
    },
    getRightBoundary: function () {
      return this.coordinates[0] + BASE_WIDTH;
    },
    getTopBoundary: function () {
      return this.coordinates[1];
    },
    getBottomBoundary: function () {
      return this.coordinates[1] + BASE_HEIGHT;
    },
  });

  // map entities init
  let mapEntities = mapData.entities;

  // TODO: filter entities that are in range of canvas

  let neighbors;

  let ppu = 1; // pixels per unit

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.frameRate(FRAME_RATE);
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

    // map
    // TODO: only render map entities that are close and inside FOV
    const mapEntitiesToRender = [];
    const boundaryBuffer = BLOCK_UNIT * 2;
    for (let entity of mapEntities) {
      if (
        entity.shape.getLeftMost() >
          fovRef.current.getLeftBoundary() - boundaryBuffer ||
        entity.shape.getRightMost() <
          fovRef.current.getRightBoundary() + boundaryBuffer ||
        entity.shape.getTopMost() > fovRef.current.getTopBoundary() - boundaryBuffer ||
        entity.shape.getBottomMost() + entity.height <
          fovRef.current.getBottomBoundary() + boundaryBuffer
      ) {
        mapEntitiesToRender.push(entity);
      }
    }

    neighbors = [];
    p5.strokeWeight(1);
    p5.stroke("#999");
    for (let entity of mapEntitiesToRender) {
      p5.fill("#fff");
      if (entity.shape.alias === "rect") {
        if (
          ((pCharRef.current.x - entity.x) ** 2 +
            (pCharRef.current.y - entity.y) ** 2) **
            0.5 <
          entity.shape.getLargestLength() +
            pCharRef.current.getHalfDiagonal() +
            pCharRef.current.contactThreshold * 4
        ) {
          neighbors.push(entity);
          p5.fill("orange");
        }
        // render
        p5.rect(
          entity.x * ppu,
          entity.y * ppu,
          entity.width * ppu,
          entity.height * ppu
        );
        // end of render
      } else if (entity.shape.alias === "tri") {
        if (
          ((pCharRef.current.x - entity.x1) ** 2 +
            (pCharRef.current.y - entity.y1) ** 2) **
            0.5 <
          entity.shape.getLargestLength() +
            pCharRef.current.getHalfDiagonal() +
            pCharRef.current.contactThreshold * 4
        ) {
          neighbors.push(entity);
          p5.fill("orange");
        }
        // render
        p5.triangle(
          entity.x1 * ppu,
          entity.y1 * ppu,
          entity.x2 * ppu,
          entity.y2 * ppu,
          entity.x3 * ppu,
          entity.y3 * ppu
        );
        // end of render
        neighbors.push(entity);
      }
    }
    // end of map

    // determine state
    const PCharState = pCharRef.current.getPlayerCharState({ p5, neighbors });
    const pCharState = new PCharState(pCharRef.current);
    // end of determine state

    // move
    if (p5.keyIsDown(32)) {
      // spacebar
      pCharState.jump();
    }

    const nextPChar = pCharState.getNextFramePChar(FRAME_DURATION, {
      p5,
      neighbors,
    });
    pCharRef.current = pCharState.adjustNextFramePChar({
      p5,
      nextPChar,
      neighbors,
    });
    // end of move

    // player character drawing
    p5.strokeWeight(0);
    if (pCharState.dead()) {
      p5.fill("red");
    } else {
      p5.fill("yellow");
    }
    p5.quad(...pCharRef.current.getVerticesPpu().map((p) => p * ppu));
    // end of player character drawing

    // key event handling
    if (p5.keyIsDown(83)) {
      // console.log(pCharState);
      console.log(pCharRef.current.getPlayerCharStatesSet({ p5, neighbors }));
    }
    if (p5.keyIsDown(p5.UP_ARROW)) {
      pCharRef.current.y -= 1;
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
      pCharRef.current.y += 1;
    } else if (p5.keyIsDown(p5.LEFT_ARROW)) {
      pCharRef.current.x -= 1;
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      pCharRef.current.x += 1;
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
