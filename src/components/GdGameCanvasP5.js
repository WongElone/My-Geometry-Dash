import React, { useRef, useEffect, useState } from "react";
import Sketch from "react-p5";
import p5Collide2dInit from "../plugins/p5.collide2d.init";
import PlayerChar from "../customs/PlayerChar";

export default function GdGameCanvasP5(props) {
  const { gameOver, setGameOver, mapData, pCharData, BASE_WIDTH, BASE_HEIGHT, BLOCK_UNIT, FOV_SETTINGS } = props;
  const FRAME_RATE = 60; // frames per second
  const FRAME_DURATION = 1 / FRAME_RATE; // second

  const pCharRef = useRef(
    new PlayerChar({
      x: pCharData.x, // in ppu
      y: pCharData.y, // in ppu
      rad: 0, // in rad
      width: pCharData.blockWidth * BLOCK_UNIT, // in block unit
      // optional parameters
      vX: 600,
      // end of optional parameters
    })
  );

  // coordinates of top left corner of FOV
  const fovRef = useRef({
    x: 0,
    y: 0,
    WIDTH: BASE_WIDTH,
    HEIGHT: BASE_HEIGHT,
    vY: 0,
    aY: 0,
    getLeftBoundary: function () {
      return this.x;
    },
    getRightBoundary: function () {
      return this.x + BASE_WIDTH;
    },
    getTopBoundary: function () {
      return this.y;
    },
    getBottomBoundary: function () {
      return this.y + BASE_HEIGHT;
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


    // update FOV
    fovRef.current.x = FOV_SETTINGS.xOffsetFromPChar + pCharRef.current.x;
    if (pCharRef.current.y < fovRef.current.y + BASE_HEIGHT * 0.3) { // too high

      // const pCharSpeedY = Math.abs(pCharRef.current.vY);
      // fovRef.current.vY -= Math.max(pCharSpeedY, 20);
      // fovRef.current.y += Math.max(fovRef.current.vY * FRAME_DURATION, -5);
      if (fovRef.current.vY > -300) {
        fovRef.current.aY = -3000;
      }
    } else if (pCharRef.current.y > fovRef.current.y + BASE_HEIGHT * 0.7) { // to low

      // const pCharSpeedY = Math.abs(pCharRef.current.vY);
      // fovRef.current.vY += Math.max(pCharSpeedY, 20);
      // fovRef.current.y += Math.min(fovRef.current.vY * FRAME_DURATION, 5);
      if (fovRef.current.vY < 300) {
        fovRef.current.aY = 3000;
      }
    } else {
      if (fovRef.current.vY < -30) {
        fovRef.current.aY = 3000;
      } else if (fovRef.current.vY > 30) {
        fovRef.current.aY = -3000;
      } else {
        fovRef.current.vY = 0;
      }
    }
    fovRef.current.y += fovRef.current.vY * FRAME_DURATION + 0.5 * fovRef.current.aY * (FRAME_DURATION ** 2);
    fovRef.current.vY += fovRef.current.aY * FRAME_DURATION;
    // end of update FOV

    // map entities
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
      if (
        ((pCharRef.current.x - entity.x) ** 2 +
          (pCharRef.current.y - entity.y) ** 2) **
          0.5 <
        entity.shape.getLargestLength() +
          pCharRef.current.getHalfDiagonal() +
          pCharRef.current.contactThreshold * 4
      ) {
        neighbors.push(entity);
      }

      // render map entities
      p5.fill("#fff");
      if (entity.shape.alias === "rect") {
        p5.rect(
          // entity.x * ppu,
          // entity.y * ppu,
          // entity.width * ppu,
          // entity.height * ppu
          (entity.x - fovRef.current.x) * ppu,
          (entity.y - fovRef.current.y) * ppu,
          entity.width * ppu,
          entity.height * ppu
        );
      } else if (entity.shape.alias === "tri") {
        p5.triangle(
          (entity.x1 - fovRef.current.x) * ppu,
          (entity.y1 - fovRef.current.y) * ppu,
          (entity.x2 - fovRef.current.x) * ppu,
          (entity.y2 - fovRef.current.y) * ppu,
          (entity.x3 - fovRef.current.x) * ppu,
          (entity.y3 - fovRef.current.y) * ppu
        );
      }
      // end of render map entities
    }
    // end of map entities

    // determine state
    const PCharState = pCharRef.current.getPlayerCharState({ p5, neighbors });
    const pCharState = new PCharState(pCharRef.current);
    console.log(PCharState);
    // end of determine state

    if (pCharState.dead() && !gameOver) {
      setGameOver(true);
    }

    // player character rendering
    p5.strokeWeight(0);
    if (pCharState.dead()) {
      p5.fill("red");
    } else {
      p5.fill("yellow");
    }
    p5.quad(...pCharRef.current.getVerticesPpu().map((p, index) => {
      if (index % 2 === 0) {
        return (p - fovRef.current.x) * ppu;
      }
      return (p - fovRef.current.y) * ppu;
    }));
    // end of player character rendering

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
