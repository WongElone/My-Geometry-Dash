import React from "react";
import Sketch from "react-p5";

export default function GdGameCanvasP5() {
  let skeleton = "----".split("");

  let ppu = 1; // pixels per unit
  let bu = 10 * ppu; // block unit (i.e. pixels per unit block)

  const pChar = {
    x: 0,
    y: 0,
    blockWidth: 1, // in block unit
    blockHeight: 1, // in block unit
  }

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    updatePpu();
    p5.createCanvas(320 * ppu, 180 * ppu).parent(canvasParentRef);
  };

  const draw = (p5) => {
    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
    updatePpu();
    fitCanvas(p5);

    if (p5.keyIsDown(p5.UP_ARROW)) {
      console.log("w");
      pChar.y -= 1;
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
      console.log("s");
      pChar.y += 1;
    }
     else if (p5.keyIsDown(p5.LEFT_ARROW)) {
      console.log("a");
      pChar.x -= 1;
     }
     else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      console.log("s");
      pChar.x += 1;
     }


    p5.background("#555");

    // map
    p5.strokeWeight(1);
    p5.stroke("#999");
    for (let i = 0; i < skeleton.length; i++) {
      p5.rect(i * bu, 15 * bu, bu, bu);
    }
    // end of map

    // player character
    p5.strokeWeight(0);
    p5.rect(pChar.x * ppu, pChar.y * ppu, pChar.blockWidth * bu, pChar.blockHeight * bu);
    // end of character
  };

  const windowResized = (p5) => {
    updatePpu();
    fitCanvas(p5);
  }

  const keyPressed = (p5) => {
  }

  function fitCanvas(p5) {
    p5.resizeCanvas(320 * ppu, 180 * ppu);
  }

  function updatePpu() {
    ppu = Math.min(
      (window.innerWidth - 60) / 320,
      (window.innerHeight - 200) / 180
    );
    bu = 10 * ppu;
  }

  return (
    <div className="gd-game-canvas-container">
      <Sketch setup={setup} draw={draw} windowResized={windowResized} keyPressed={keyPressed}/>
    </div>
  );
}
