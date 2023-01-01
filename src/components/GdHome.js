import React from "react";
import GdButton from "./GdButton";
import "../css/gd-home.scss";
import { AppContext } from "../App";

export default function GdHome() {
  return (
    <AppContext.Consumer>
      {({ appState, setAppState }) => (
        <section className="gd-home">
          <div className="title">Geometry Dash</div>
          <div className="btns-container">
            <GdButton
              impulseBg={true}
              onClick={() => {
                setAppState({...appState, in: 'select-map'});
              }}
            >
              Start !
            </GdButton>
            <GdButton onClick={() => setAppState({...appState, in: 'home->settings'})}>
              Settings
            </GdButton>
          </div>
        </section>
      )}
    </AppContext.Consumer>
  );
}
