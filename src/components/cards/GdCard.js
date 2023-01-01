import React from "react";
import "../../css/cards/gd-card.scss";

export default function GdCard(props) {
  return (
    <div
      className={"gd-card-container " + (props.className ? props.className : "")}
    >
      <article className="gd-card">{props.children}</article>
    </div>
  );
}
