export default class PlayerCharState {
  constructor(pChar) {
    this.pChar = pChar;
    this.accelX = null;
    this.accelY = null;
  }

  jump() {
    return this;
  }

  rotate() {
    return this;
  }

  getNextFramePChar() {
    return this.pChar;
  }
}
