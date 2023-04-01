import React from "react";
import GdButton from "../GdButton";
import GdGameBaseDialog from "./GdGameBaseDialog";
import "../../css/dialogs/gd-dialog.scss";

export default function GdGamePauseDialog(props) {
  const { setOpen, onClose, onGiveUp } = props;
  return (
    <GdGameBaseDialog setOpen={setOpen} onClose={onClose}>
      <div style={{ fontWeight: 600, fontSize: "26px", paddingBottom: "15px" }}>
        Map Name
      </div>
      <GdButton
        onClick={onGiveUp}
      >
        Give Up
      </GdButton>
    </GdGameBaseDialog>
  );
}
