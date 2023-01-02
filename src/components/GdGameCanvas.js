import React, { useState, useEffect, useContext } from "react";
import { fabric } from "fabric";
import GdButton from "./GdButton";
import { AppContext } from "../App";

export default function GdGameCanvas() {
  const [gameCanvas, setGameCanvas] = useState(null);
  const { appState, setAppState } = useContext(AppContext);

  useEffect(() => {
    setGameCanvas(initGameCanvas());
  }, []);

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

  useEffect(() => {
    if (!gameCanvas) return;
    const circle = new fabric.Circle({
      radius: 20,
      fill: "yellow",
      left: 100,
      top: 100,
    });
    gameCanvas.add(circle);
  }, [gameCanvas]);

  function initGameCanvas() {
    return new fabric.Canvas("gd_game_canvas", {
      height: 180,
      width: 320,
      backgroundColor: "green",
    });
  }

  return (
    <div className="gd-game-canvas-container">
      <canvas id="gd_game_canvas" className="gd-game-canvas">
        Geometry Dash Game Canvas
      </canvas>
    </div>
    //   <GdButton
    //   onClick={() => {
    //     console.log(gameCanvas);
    //     console.log(gameCanvas.lowerCanvasEl);
    //   }}
    // >
    //   Canvas
    // </GdButton>
  );
}
