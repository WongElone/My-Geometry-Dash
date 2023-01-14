import React, { useEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import GdButton from "./GdButton";
import GdGameCanvasP5 from "./GdGameCanvasP5";
import Loading from "./Loading";
import "../css/gd-game.scss";
import axios from "axios";

export default function GdGame() {
  const BASE_WIDTH = 640; // ppu
  const BASE_HEIGHT = 360; // ppu
  const BLOCK_UNIT = 20; // block unit (i.e. number of ppu per block)
  const BUFFER_BLOCKS = 5; // block unit
  const START_POINT_X = BUFFER_BLOCKS * BLOCK_UNIT; // ppu
  const START_POINT_Y = BASE_HEIGHT - 3.2 * BLOCK_UNIT; // ppu
  const pCharData = {
    x: START_POINT_X, // ppu
    y: START_POINT_Y - 0.9 * BLOCK_UNIT, // ppu
    blockWidth: 0.9, // block unit
    blockHeight: 0.9, // block unit
  };

  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [rawMapEntities, setRawMapEntities] = useState(null);
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let resp = await axios.get("/entities.ett");
      setRawMapEntities(await resp.data);
    };

    fetchData().catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (rawMapEntities === null) return;

    const mapEntities = [];

    // add buffer blocks before starting point
    for (let i = 0; i < BUFFER_BLOCKS; i++) {
      mapEntities.push({
        shape: "rect",
        type: "safe",
        // everything in ppu
        x: START_POINT_X - (BUFFER_BLOCKS - i) * BLOCK_UNIT,
        y: START_POINT_Y,
        width: BLOCK_UNIT,
        height: BLOCK_UNIT,
      });
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
    
    // TODO: reduce height of rect
    // TODO: handle upward slope and downward slope
    levels.forEach((level, index) => {
      let oY = START_POINT_Y + (index - startLevelIndex) * 1 * BLOCK_UNIT; // y displacement from canvas origin in ppu
      let oX = START_POINT_X; // x displacement from canvas origin in ppu
      for (let i in level) {
        const entity = level[i];
        if (entity === " ") {
        } else if (entity === "-" || entity === "s") {
          mapEntities.push({
            shape: "rect",
            type: "safe",
            // everything in ppu
            x: oX,
            y: oY,
            width: BLOCK_UNIT,
            height: BLOCK_UNIT,
          });
        } else if (entity === "^") {
          mapEntities.push({
            shape: "tri",
            type: "die",
            // everything in ppu
            x1: oX,
            y1: oY + BLOCK_UNIT,
            x2: oX + BLOCK_UNIT,
            y2: oY + BLOCK_UNIT,
            x3: oX + 0.5 * BLOCK_UNIT,
            y3: oY + 0.2 * BLOCK_UNIT,
          });
        } else if (entity === "v") {
          mapEntities.push({
            shape: "tri",
            type: "die",
            // everything in ppu
            x1: oX,
            y1: oY,
            x2: oX + BLOCK_UNIT,
            y2: oY,
            x3: oX + 0.5 * BLOCK_UNIT,
            y3: oY + 0.8 * BLOCK_UNIT,
          });
        } else {
          continue;
        }
        oX += BLOCK_UNIT;
      }
    });
    // end of add map entities

    console.log("Map Entities", mapEntities);
    setMapData({ ...mapData, entities: mapEntities });
  }, [rawMapEntities]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (mapData.entities.length) {
        setIsLoadingMap(false);
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [mapData]);

  return (
    <>
      <AppContext.Consumer>
        {({ appState, setAppState }) => (
          <div className="gd-game">
            <div>{JSON.stringify(appState)}</div>
            {(() => {
              if (isLoadingMap) {
                return <Loading />;
              } else {
                return (
                  <div style={{ padding: "30px" }}>
                    <GdGameCanvasP5
                      mapData={mapData}
                      pCharData={pCharData}
                      BLOCK_UNIT={BLOCK_UNIT}
                      BASE_WIDTH={BASE_WIDTH}
                      BASE_HEIGHT={BASE_HEIGHT}
                    />
                  </div>
                );
              }
            })()}
            <GdButton
              onClick={() =>
                setAppState({ ...appState, in: "select-map", game: null })
              }
            >
              Back
            </GdButton>
          </div>
        )}
      </AppContext.Consumer>
    </>
  );
}
