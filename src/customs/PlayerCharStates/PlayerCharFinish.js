import PlayerCharState from "./PlayerCharState";

export default class PlayerCharFinish extends PlayerCharState {
  constructor(pChar) {
    super(pChar);
    this.pChar = pChar;
  }

  getNextFramePChar(FRAME_DURATION) {
    return super.getNextFramePChar(FRAME_DURATION);
  }

  finish() {
    return true;
  }
}
