import React from "react";
import { AppContext } from "../App";
import GdButton from "./GdButton";
import GdMapSelectionCard from "./cards/GdMapSelectionCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../css/gd-map-selection.scss";
import sampleMapPV from "../images/sample-map-preview.png";

export default function GdMapSelection() {
  return (
    <AppContext.Consumer>
      {({ appState, setAppState }) => (
        <section className="gd-map-selection">
          <div className="title">Choose A Map</div>
          <div className="map-listing-container">
            <Swiper
              centeredSlides={true}
              slidesPerView={"auto"}
              className="map-listing"
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
          <GdButton onClick={() => setAppState({ ...appState, in: "home" })}>
            Back
          </GdButton>
        </section>
      )}
    </AppContext.Consumer>
  );
}
