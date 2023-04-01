import React from "react";
import GdButton from "../GdButton";
import GdGameBaseDialog from "./GdGameBaseDialog";
import "../../css/dialogs/gd-dialog.scss";

export default function GdGameOverDialog(props) {
  const { setOpen, onClose, onRetry } = props;
  return (
    <GdGameBaseDialog
      setOpen={setOpen}
      onClose={onClose}
    >
      <div style={{ fontWeight: 600, fontSize: "26px", paddingBottom: "15px" }}>
        Game Over
      </div>
      <GdButton
        onClick={() => {
          setOpen(false);
          onRetry();
        }}
        impulseBg={true}
      >
        Retry
      </GdButton>
    </GdGameBaseDialog>
  );
}
