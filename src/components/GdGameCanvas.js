import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import GdButton from "./GdButton";

export default function GdGameCanvas() {
  const [gameCanvas, setGameCanvas] = useState(null);

  useEffect(() => {
    setGameCanvas(initGameCanvas());
  }, []);

  function initGameCanvas() {
    return new fabric.Canvas("gd_game_canvas", {
      height: 400,
      width: 400,
      backgroundColor: "gold",
    });
  }
  return (
    <div>
      <canvas id="gd_game_canvas">Geometry Dash Game Canvas</canvas>
      <GdButton
        onClick={() => {
          console.log(gameCanvas);
          console.log(gameCanvas.lowerCanvasEl);
        }}
      >
        Canvas
      </GdButton>
    </div>
  );
}
