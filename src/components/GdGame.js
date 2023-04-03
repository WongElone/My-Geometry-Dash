import React, { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../App";
import GdGameCanvasP5 from "./GdGameCanvasP5";
import Loading from "./Loading";
import "../css/gd-game.scss";
import axios from "axios";
import Entity from "../customs/Entities/Entity";
import GdGameOverDialog from "./dialogs/GdGameOverDialog";
import GdGamePauseDialog from "./dialogs/GdGamePauseDialog";
import GdIconButton from "./GdIconButton";
import GdGameFinishDialog from "./dialogs/GdGameFinishDialog";
import PauseIcon from "../images/icons/pause-64.png";

export default function GdGame() {
  const BASE_WIDTH = 640 * 3; // ppu
  const BASE_HEIGHT = 360 * 3; // ppu
  const BLOCK_UNIT = 30 * 3; // block unit (i.e. number of ppu per block)
  const BUFFER_BLOCKS = 5; // block unit
  const START_POINT_X = BUFFER_BLOCKS * BLOCK_UNIT; // ppu
  const START_POINT_Y = BASE_HEIGHT - 3.2 * BLOCK_UNIT; // ppu
  const pCharData = {
    x: START_POINT_X - 0.5 * BLOCK_UNIT, // ppu
    y: START_POINT_Y - 0.45 * BLOCK_UNIT - 1, // ppu
    blockWidth: 0.9, // block unit
    blockHeight: 0.9, // block unit
  };
  const FOV_SETTINGS = {
    xOffsetFromPChar: - pCharData.x,
  }

  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [rawMapEntities, setRawMapEntities] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [openGameOverDialog, setOpenGameOverDialog] = useState(false);
  const [gamePause, setGamePause] = useState(false);
  const [openGamePauseDialog, setOpenGamePauseDialog] = useState(false);
  const [gameFinish, setGameFinish] = useState(false);
  const [openGameFinishDialog, setOpenGameFinishDialog] = useState(false);
  const hoveringPauseBtn = useRef(false);
  const {appState, setAppState} = useContext(AppContext);

  useEffect(() => {
    setOpenGameOverDialog(gameOver);
  }, [gameOver]);

  useEffect(() => {
    setOpenGamePauseDialog(gamePause);
  }, [gamePause]);

  useEffect(() => {
    setOpenGameFinishDialog(gameFinish);
  }, [gameFinish]);

  // fetch map data from map raw data file, put the raw data in rawMapEntities
  useEffect(() => {
    const fetchData = async () => {
      let resp = await axios.get(appState.game.map.entities);
      setRawMapEntities(await resp.data);
    };

    fetchData().catch((err) => console.error(err));
  }, []);

  // when rawMapEntities are populated, will trigger this use effect which populate mapData
  useEffect(() => {
    if (rawMapEntities === null) return;

    const mapEntities = [];

    // add buffer blocks before starting point
    for (let i = 0; i < BUFFER_BLOCKS; i++) {
      mapEntities.push(new Entity({
        shapeAlias: "rect",
        type: "safe",
        penetrable: false,
        // everything in ppu
        x: START_POINT_X - (BUFFER_BLOCKS - i) * BLOCK_UNIT,
        y: START_POINT_Y,
        width: BLOCK_UNIT,
        height: BLOCK_UNIT,
      }));
    }
    // end of add buffer blocks before starting point

    // add map entities
    const levels = rawMapEntities.split(";");

    let startLevelIndex = -1;
    levels.forEach((level, index) => {
      if (level.trim()[0] === "s") {
        startLevelIndex = index;
      }
    });
    
    let finishPointOX;
    levels.forEach((level, index) => {
      let oY = START_POINT_Y + (index - startLevelIndex) * 1 * BLOCK_UNIT; // y displacement from canvas origin in ppu
      let oX = START_POINT_X; // x displacement from canvas origin in ppu
      for (let i in level) {
        const entity = level[i];
        if (entity === " ") {
        } else if (entity === "-" || entity === "s") {
          mapEntities.push(new Entity({
            shapeAlias: "rect",
            type: "safe",
            penetrable: false,
            // everything in ppu
            x: oX,
            y: oY,
            width: BLOCK_UNIT,
            height: BLOCK_UNIT,
          }));
        } else if (entity === "^") {
          mapEntities.push(new Entity({
            shapeAlias: "tri",
            type: "die",
            penetrable: true,
            // everything in ppu
            x1: oX,
            y1: oY + BLOCK_UNIT,
            x2: oX + BLOCK_UNIT,
            y2: oY + BLOCK_UNIT,
            x3: oX + 0.5 * BLOCK_UNIT,
            y3: oY + 0.2 * BLOCK_UNIT,
          }));
        } else if (entity === "v") {
          mapEntities.push(new Entity({
            shapeAlias: "tri",
            type: "die",
            penetrable: true,
            // everything in ppu
            x1: oX,
            y1: oY,
            x2: oX + BLOCK_UNIT,
            y2: oY,
            x3: oX + 0.5 * BLOCK_UNIT,
            y3: oY + 0.8 * BLOCK_UNIT,
          }));
        } else if (entity === "x") { // the border
          // top triangle
          mapEntities.push(new Entity({
            shapeAlias: "tri",
            type: "die",
            penetrable: true,
            p5_fill: "#333",
            p5_stroke: "#333",
            // everything in ppu
            x1: oX,
            y1: oY + BLOCK_UNIT,
            x2: oX + BLOCK_UNIT,
            y2: oY + BLOCK_UNIT,
            x3: oX + 0.5 * BLOCK_UNIT,
            y3: oY + 0.7 * BLOCK_UNIT,
          }));
          // // left side triangles
          // for (let y = 1; y < 10; y++) {
          //   mapEntities.push(new Entity({
          //     shapeAlias: "tri",
          //     type: "die",
          //     penetrable: true,
          //     // everything in ppu
          //     x1: oX,
          //     y1: oY + y * BLOCK_UNIT,
          //     x2: oX - 0.3 * BLOCK_UNIT,
          //     y2: oY + (y + 0.5) * BLOCK_UNIT,
          //     x3: oX,
          //     y3: oY + (y + 1) * BLOCK_UNIT,
          //   }));
          // }
          // // right side triangles
          // for (let y = 1; y < 10; y++) {
          //   mapEntities.push(new Entity({
          //     shapeAlias: "tri",
          //     type: "die",
          //     penetrable: true,
          //     // everything in ppu
          //     x1: oX + BLOCK_UNIT,
          //     y1: oY + y * BLOCK_UNIT,
          //     x2: oX + 1.3 * BLOCK_UNIT,
          //     y2: oY + (y + 0.5) * BLOCK_UNIT,
          //     x3: oX + BLOCK_UNIT,
          //     y3: oY + (y + 1) * BLOCK_UNIT,
          //   }));
          // }
          // pillar
          mapEntities.push(new Entity({
            shapeAlias: "rect",
            type: "die",
            penetrable: true,
            p5_fill: "#333",
            p5_stroke: "#333",
            // everything in ppu
            x: oX,
            y: oY + BLOCK_UNIT,
            width: BLOCK_UNIT,
            height: BLOCK_UNIT * 50,
          }));
        } else if (entity === "f") {
          finishPointOX = oX;
        } else {
          continue;
        }
        oX += BLOCK_UNIT;
      }
    });
    if (!finishPointOX) {
      throw new Error("finish point not found in .ett file");
    }
    mapEntities.push(new Entity({
      shapeAlias: "rect",
      type: "finish",
      penetrable: true,
      p5_fill: "green",
      p5_stroke: "green",
      // everything in ppu
      x: finishPointOX,
      y: - BLOCK_UNIT * 50,
      width: BLOCK_UNIT * 50,
      height: BLOCK_UNIT * 500,
    }));
    // end of add map entities

    console.log("Map Entities", mapEntities);
    setMapData({ ...mapData, entities: mapEntities });
  }, [rawMapEntities]);

  // after mapData is populated, will trigger this useEffect which will wait for 1 second before turning isLoadingMap to false
  // when it is false, the loading page disappear and enter the game page
  // as a result, no matter how fast the map raw data fetching is, the loading page will stay at least 1 second, which gives better user experience
  useEffect(() => {
    if (!isLoadingMap) return;

    const timerId = setTimeout(() => {
      if (mapData.entities.length) {
        setIsLoadingMap(false);
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [mapData, isLoadingMap]);

  return (
    <>
      <AppContext.Consumer>
        {({ appState, setAppState }) => (
          <div className="gd-game">
            {(() => {
              if (isLoadingMap) {
                return <Loading />;
              } else {
                return (
                  <div style={{ padding: "0", position: "relative" }}>
                    <GdGameCanvasP5
                      gameOver={gameOver}
                      setGameOver={setGameOver}
                      gamePause={gamePause}
                      setGamePause={setGamePause}
                      gameFinish={gameFinish}
                      setGameFinish={setGameFinish}
                      hoveringPauseBtn={hoveringPauseBtn}
                      mapData={mapData}
                      pCharData={pCharData}
                      BLOCK_UNIT={BLOCK_UNIT}
                      BASE_WIDTH={BASE_WIDTH}
                      BASE_HEIGHT={BASE_HEIGHT}
                      FOV_SETTINGS={FOV_SETTINGS}
                    />
                    {openGameOverDialog && 
                      <GdGameOverDialog
                        setOpen={setOpenGameOverDialog}
                        onClose={() => {
                          setAppState({ ...appState, in: "select-map", game: null });
                        }}
                        onRetry={() => {
                          setIsLoadingMap(true);
                          setGameOver(false);
                        }}
                      />
                    }
                    {openGameFinishDialog && 
                      <GdGameFinishDialog
                        setOpen={setOpenGameFinishDialog}
                        onClose={() => {
                          setAppState({ ...appState, in: "select-map", game: null });
                        }}
                        onRetry={() => {
                          setIsLoadingMap(true);
                          setGameFinish(false);
                        }}
                      />
                    }
                    {openGamePauseDialog &&
                      <GdGamePauseDialog
                        setOpen={setOpenGamePauseDialog}
                        onClose={() => {
                          setOpenGamePauseDialog(false);
                          setGamePause(false);
                          hoveringPauseBtn.current = false;
                        }}
                        onGiveUp={() => {
                          setAppState({ ...appState, in: "select-map", game: null });
                        }}
                        mapName={appState.game.map.name}
                      />
                    }
                    {!gamePause && !gameOver && !gameFinish && 
                      <div className="pause-btn-container">
                        <GdIconButton
                          onClick={() => setGamePause(true)}
                          onMouseEnter={() => hoveringPauseBtn.current = true}
                          onMouseLeave={() => hoveringPauseBtn.current = false}
                          onTouchStart={() => hoveringPauseBtn.current = true}
                          onTouchEnd={() => hoveringPauseBtn.current = false}
                          icon={PauseIcon}
                          width={"30px"}
                          height={"30px"}
                        />
                      </div>
                    }
                  </div>
                );
              }
            })()}
          </div>
        )}
      </AppContext.Consumer>
    </>
  );
}
