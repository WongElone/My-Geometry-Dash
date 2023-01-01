import React, { useState } from "react";
import "./App.scss";
import GdHome from "./components/GdHome";
import GdMapSelection from "./components/GdMapSelection";
import GdHomeSettings from "./components/GdHomeSettings";

export const AppContext = React.createContext();

function App() {
  const [appState, setAppState] = useState({
    in: "home",
  });

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <div className="gd-app">
        <h1 style={{ display: "none" }}>Geometry Dash</h1>
        {appState.in === "home" && <GdHome />}
        {appState.in === "select-map" && <GdMapSelection />}
        {appState.in === "home->settings" && <GdHomeSettings />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
