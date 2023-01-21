export default class PlayerCharState {
  constructor(pChar) {
    this.pChar = pChar;
  }

  jump() {
    return this;
  }

  rotate() {
    return this;
  }

  getNextFramePChar(FRAME_DURATION) { // frame duration = time taken for one frame
    this.pChar.x += this.pChar.vX * FRAME_DURATION;
    this.pChar.y += this.pChar.vY * FRAME_DURATION;
    this.pChar.rad += this.pChar.vRad * FRAME_DURATION;
    return this.pChar;
  }

  dead() {
    return false;
  }
}
