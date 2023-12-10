import React, { useEffect, useState } from "react";
import { AppContext } from "../App";
import GdButton from "./GdButton";
import GdMapSelectionCard from "./cards/GdMapSelectionCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../css/gd-map-selection.scss";
import { MAPS_INFO_LIST } from "../constants";
import GdIconButton from "./GdIconButton";
import StartIcon from "../images/icons/play-6-64.png";
import BackIcon from "../images/icons/arrow-81-64.png";

export default function GdMapSelection() {
  const [startBtnProps, setStartBtnProps] = useState({
    hidden: false,
    disabled: false,
  });
  const [mapSwiper, setMapSwiper] = useState(null);

  function startBtnClickHandler({ appState, setAppState }) {
    const mapInfo = MAPS_INFO_LIST[mapSwiper.activeIndex];
    const game = {
      map: {
        name: mapInfo.name,
        entities: mapInfo.entities,
      },
    };
    setAppState({ ...appState, in: "game", game });
  }

  function hideStartBtn() {
    setStartBtnProps({
      ...startBtnProps,
      hidden: true,
      disabled: true,
    });
  }

  function showStartBtn() {
    setStartBtnProps({
      ...startBtnProps,
      hidden: false,
      disabled: false,
    });
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
              onTouchStart={hideStartBtn}
              onTouchMove={hideStartBtn}
              onTouchEnd={showStartBtn}
              onTransitionStart={hideStartBtn}
              onTransitionEnd={showStartBtn}
            >
              {MAPS_INFO_LIST.map((mapInfo, index) => (
                <SwiperSlide key={index}>
                  <GdMapSelectionCard>
                    <img
                      src={mapInfo.thumbnail}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    ></img>
                  </GdMapSelectionCard>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="map-name">
              {typeof mapSwiper?.activeIndex === "number" && MAPS_INFO_LIST[mapSwiper.activeIndex].name}
            </div>
          </div>
          <div className="btns-container">
            <GdButton
              disabled={startBtnProps.disabled}
              hidden={startBtnProps.hidden}
              impulseBg={true}
              onClick={() => startBtnClickHandler({ appState, setAppState })}
            >
              {/* &#9654;  */}
              <img src={StartIcon} className="icon-img" />
              &nbsp;Start
            </GdButton>
            <GdButton onClick={() => setAppState({ ...appState, in: "home" })}>
              {/* ⮨ */}
              <img src={BackIcon} className="icon-img" />
              &nbsp;Back
            </GdButton>
          </div>
          <div className="back-icon-btn-container">
            <GdIconButton 
              onClick={() => setAppState({ ...appState, in: "home" })} 
              icon={BackIcon}
              width={"30px"}
              height={"30px"}
            />
          </div>
        </section>
      )}
    </AppContext.Consumer>
  );
}
