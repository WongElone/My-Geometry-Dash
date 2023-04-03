import React from "react";
import GdIconButton from "../GdIconButton";
import "../../css/dialogs/gd-dialog.scss";
import CloseIcon from "../../images/icons/x-mark-64.png";

export default function GdGameBaseDialog(props) {
  const { setOpen, onClose, children } = props;
  return (
    <div
      style={{
        zIndex: "1000",
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={"gd-dialog-container"}>
        <article className="gd-dialog">
          <div className="close-btn">
            <GdIconButton
              onClick={() => {
                setOpen(false);
                onClose();
              }}
              icon={CloseIcon}
              width={"30px"}
              height={"30px"}
            />
          </div>
          {children}
        </article>
      </div>
    </div>
  );
}
