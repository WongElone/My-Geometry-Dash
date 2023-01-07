import React, { useState, useEffect, useContext, useRef } from "react";
import { fabric } from "fabric";
import { AppContext } from "../App";

export default function GdGameCanvas() {
  const [gameCanvas, setGameCanvas] = useState(null);
  const { appState, setAppState } = useContext(AppContext);
  const frameCount = useRef(0);

  useEffect(() => {
    setGameCanvas(initGameCanvas());
  }, []);

  // scaling canvas when window resize
  useEffect(() => {
    if (!gameCanvas) return;

    // const gcEl = gameCanvas.lowerCanvasEl;
    const scaleRatio = Math.min(
      (appState.window.vw - 60) / 320,
      (appState.window.vh - 200) / 180
    );
    // scaling canvas
    gameCanvas.setDimensions({
      width: 320 * scaleRatio,
      height: 180 * scaleRatio,
    });
    gameCanvas.setZoom(scaleRatio);
    // end of scaling canvas

    // scaling outer container
    const outerContainer = gameCanvas.wrapperEl.parentElement;
    outerContainer.style.width = 320 * scaleRatio + "px";
    outerContainer.style.height = 180 * scaleRatio + "px";
    // end of scaling outer container
  }, [appState.window.vw, appState.window.vh, gameCanvas]);

  // init game canvas
  useEffect(() => {
    if (!gameCanvas) return;

    // init game objects
    const circle = new fabric.Circle({
      radius: 20,
      fill: "yellow",
      left: 0,
      top: 0,
      hoverCursor: "auto",
      selectable: false,
    });
    gameCanvas.add(circle);
    circle.set({left: 330, top: 100});
    
    let skeleton = '---- ---/';
    skeleton = skeleton.split("");
    for (let i = 0; i < skeleton.length; i++) {
        console.log(skeleton[i]);
        let newItem = null;

        if (skeleton[i] === ' ') {
            
        } else if (skeleton[i] === '-') {
            newItem = new fabric.Rect({
                left: 10 * i,
                top: 50,
                width: 10,
                height: 10,
                fill: "yellow",
                // stroke: "white",
                // strokeWidth: 0.1,
                hoverCursor: "auto",
                selectable: false,
            });
        } else if (skeleton[i] === '/') {
            newItem = new fabric.Rect({
                left: 10 * i,
                top: 50,
                width: 10,
                height: 10,
                fill: "yellow",
                // stroke: "white",
                // strokeWidth: 0.1,
                hoverCursor: "auto",
                selectable: false,
            });
        }

        if (newItem) {
            gameCanvas.add(newItem);
            // newItem.set({left: 10 * i});
        }
    }
    // end of init game objects

    // execute game loop
    window.requestAnimationFrame((timeStamp) => {
      animate({ timeStamp, gameCanvas });
    });
    // end of execute game loop
  }, [gameCanvas]);

  // game loop
  function animate(props) {
    const { timeStamp, gameCanvas } = props;
    // console.log("tick-tok");
    frameCount.current += 1;
    if (frameCount.current % 60 === 0) {
      frameCount.current = 0;
      // console.log(timeStamp);
    }

    // TODO: do I need to remove listener before adding to ensure only listener is mounted
    document.addEventListener("keydown", keyEventHandler);

    window.requestAnimationFrame(animate);
  }
  // end of game loop

  function initGameCanvas() {
    return new fabric.Canvas("gd_game_canvas", {
      height: 180,
      width: 320,
      backgroundColor: "green",
      selection: false,
    });
  }

  function keyEventHandler(e) {
    const item = gameCanvas.item(0);
    console.log(e.key);
    // gameCanvas.item(0).dirty = true;
    console.log(item);

    let rerender = true;
    if (e.key === "w") {
      item.top -= 1;
    } else if (e.key === "a") {
      item.left -= 1;
    } else if (e.key === "s") {
      item.top += 1;
    } else if (e.key === "d") {
      item.left += 1;
    } else {
        rerender = false;
    }
    if (rerender) gameCanvas.renderAll();
  }

  return (
    <div className="gd-game-canvas-container">
      <canvas id="gd_game_canvas" className="gd-game-canvas">
        Geometry Dash Game Canvas
      </canvas>
    </div>
  );
}
