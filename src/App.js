import React, { useState } from "react";
import "./App.scss";
import GdHome from "./components/GdHome";
import GdMapSelection from "./components/GdMapSelection";

export const AppContext = React.createContext();

function App() {
  const [appState, setAppState] = useState({
    in: "home",
  });

  console.log(appState.in);

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <div className="gd-app">
        <h1 style={{ display: "none" }}>Geometry Dash</h1>
        {appState.in === "home" && <GdHome />}
        {appState.in === "select-map" && <GdMapSelection />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
