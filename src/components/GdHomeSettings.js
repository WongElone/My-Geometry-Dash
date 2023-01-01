import React from "react";
import GdButton from "./GdButton";
import { AppContext } from "../App";

export default function GdHomeSettings() {
  return (
    <AppContext.Consumer>
      {({ appState, setAppState }) => (
        <div>
          <GdButton onClick={() => setAppState({ ...appState, in: "home" })}>
            Back
          </GdButton>
        </div>
      )}
    </AppContext.Consumer>
  );
}
