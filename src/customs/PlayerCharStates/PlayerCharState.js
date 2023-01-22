export default class PlayerCharState {
  constructor(pChar) {
    this.pChar = pChar;
  }

  jump() {
    // this method is called when spacebar is pressed
    // update pChar properties
  }

  getNextFramePChar(FRAME_DURATION) { // frame duration = time taken for one frame
    const nextPChar = this.pChar;
    // update position of nextPChar
    return nextPChar;
  }

  adjustNextFramePChar({ p5, nextPChar, neighbors }) {
    // adjust position of nextPChar
    return nextPChar;
  }

  dead() {
    return false;
  }
}
