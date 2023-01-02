import React, { useState, useEffect } from "react";
import "./App.scss";
import GdHome from "./components/GdHome";
import GdMapSelection from "./components/GdMapSelection";
import GdHomeSettings from "./components/GdHomeSettings";
import GdGame from "./components/GdGame";

export const AppContext = React.createContext();

function App() {
  const [appState, setAppState] = useState({
    in: "home",
    game: {
      map: {
        path: null,
      },
    },
    window: {
      vw: getVw(),
      vh: getVh(),
    },
  });

  useEffect(() => {
    function handleResize() {
      setAppState({... appState, window: {vw: getVw(), vh: getVh()}});
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [getVw, getVh]);

  function getVh() {
    return Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
  }

  function getVw() {
    return Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
  }

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <div className="gd-app">
        <h1 style={{ display: "none" }}>Geometry Dash</h1>
        {(() => {
          if (appState.in === "home") {
            return <GdHome />;
          } else if (appState.in === "select-map") {
            return <GdMapSelection />;
          } else if (appState.in === "home->settings") {
            return <GdHomeSettings />;
          } else if (appState.in === "game") {
            return <GdGame />;
          }
        })()}
      </div>
    </AppContext.Provider>
  );
}

export default App;
