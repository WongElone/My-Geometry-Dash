import PlayerCharState from "./PlayerCharState";

export default class PlayerCharFallFromGround extends PlayerCharState {
  constructor(pChar) {
    super(pChar);
  }

  getNextFramePChar(FRAME_DURATION) {
    console.log("fall from ground");
    return this.pChar;
  }
}
