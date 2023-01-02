import React, { useState, useEffect, useContext, useRef } from "react";
import { fabric } from "fabric";
import GdButton from "./GdButton";
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

  // test circle
  useEffect(() => {
    if (!gameCanvas) return;
    const circle = new fabric.Circle({
      radius: 20,
      fill: "yellow",
      left: 100,
      top: 100,
      hoverCursor: "auto",
    });
    circle.selectable = false;
    gameCanvas.add(circle);

    window.requestAnimationFrame((timeStamp) => {
      animate({ timeStamp, gameCanvas });
    });
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
    console.log(e.key);

    if (e.key === "w") {
      gameCanvas.item(0).top -= 1;
      gameCanvas.renderAll();
    } else if (e.key === "a") {
      gameCanvas.item(0).left -= 1;
      gameCanvas.renderAll();
    } else if (e.key === "s") {
      gameCanvas.item(0).top += 1;
      gameCanvas.renderAll();
    } else if (e.key === "d") {
      gameCanvas.item(0).left += 1;
      gameCanvas.renderAll();
    }
  }

  return (
    <div className="gd-game-canvas-container">
      <canvas id="gd_game_canvas" className="gd-game-canvas">
        Geometry Dash Game Canvas
      </canvas>
    </div>
  );
}
