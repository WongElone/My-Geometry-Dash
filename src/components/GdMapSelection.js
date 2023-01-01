import React, { useState } from "react";
import { AppContext } from "../App";
import GdButton from "./GdButton";
import GdMapSelectionCard from "./cards/GdMapSelectionCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../css/gd-map-selection.scss";
import sampleMapPV from "../images/sample-map-preview.png";

export default function GdMapSelection() {
  const [startBtnProps, setStartBtnProps] = useState({
    hidden: false,
    disabled: false,
  });
  const [mapSwiper, setMapSwiper] = useState(null);
  const mapsInfoList = [
    {
      path: './map_1_path',
      name: 'Map 1',
    },
    {
      path: './map_2_path',
      name: 'Map 2',
    },
    {
      path: './map_3_path',
      name: 'Map 3',
    },
    {
      path: './map_4_path',
      name: 'Map 4',
    },
  ]

  function startBtnClickHandler({appState, setAppState}) {
    const mapInfo = mapsInfoList[mapSwiper.activeIndex];
    const game = {
      map: {
        path: mapInfo.path,
      }
    }
    setAppState({...appState, in: 'game', game})
  }

  return (
    <AppContext.Consumer>
      {({ appState, setAppState }) => (
        <section className="gd-map-selection">
          <div className="title">Choose A Map</div>
          <div className="map-listing-container">
            <Swiper
              onSwiper={(swiper) => setMapSwiper(swiper)}
              centeredSlides={true}
              slidesPerView={"auto"}
              className="map-listing"

              onTransitionStart={() => {
                setStartBtnProps({
                  ...startBtnProps,
                  hidden: true,
                  disabled: true,
                });
              }}
              onTransitionEnd={() => {
                setStartBtnProps({
                  ...startBtnProps,
                  hidden: false,
                  disabled: false,
                });
              }}
            >
              <SwiperSlide>
                <GdMapSelectionCard>
                  <img
                    src={sampleMapPV}
                    alt="sample map preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  ></img>
                </GdMapSelectionCard>
              </SwiperSlide>
              <SwiperSlide>
                <GdMapSelectionCard>
                  <img
                    src={sampleMapPV}
                    alt="sample map preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  ></img>
                </GdMapSelectionCard>
              </SwiperSlide>
              <SwiperSlide>
                <GdMapSelectionCard>
                  <img
                    src={sampleMapPV}
                    alt="sample map preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  ></img>
                </GdMapSelectionCard>
              </SwiperSlide>
              <SwiperSlide>
                <GdMapSelectionCard>
                  <img
                    src={sampleMapPV}
                    alt="sample map preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  ></img>
                </GdMapSelectionCard>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="btns-container">
            <GdButton
              disabled={startBtnProps.disabled}
              hidden={startBtnProps.hidden}
              impulseBg={true}
              onClick={() => startBtnClickHandler({appState, setAppState})}
            >
              Start !
            </GdButton>
            <GdButton onClick={() => setAppState({ ...appState, in: "home" })}>
              Back
            </GdButton>
          </div>
        </section>
      )}
    </AppContext.Consumer>
  );
}
