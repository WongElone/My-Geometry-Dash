import React from "react";
import { AppContext } from "../App";
import GdButton from "./GdButton";

export default function GdGame() {
  return (
    <AppContext.Consumer>
      {({ appState, setAppState }) => (
        <div>
          <div>{JSON.stringify(appState)}</div>
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
