import React from "react";
import { AppContext } from "../App";
import GdButton from "./GdButton";
import GdGameCanvas from "./GdGameCanvas";
import GdGameCanvasP5 from "./GdGameCanvasP5";
import '../css/gd-game.scss'

export default function GdGame() {
  return (
    <AppContext.Consumer>
      {({ appState, setAppState }) => (
        <div className="gd-game">
          <div>{JSON.stringify(appState)}</div>
          <div style={{padding: "30px"}}>
            <GdGameCanvasP5 />
          </div>
          <GdButton
            onClick={() => setAppState({ ...appState, in: "select-map", game: null })}
          >
            Back
          </GdButton>
        </div>
      )}
    </AppContext.Consumer>
  );
}
