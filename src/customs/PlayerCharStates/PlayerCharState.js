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
    nextPChar.prev = {
      x: this.pChar.x,
      y: this.pChar.y,
      rad: this.pChar.rad,
    }
    return nextPChar;
    // children class should override this method
    // by creating a variable and call super.getNextFramePChar (const nextPChar = super.getNextFramePChar();)
    // and then update position of nextPChar
  }

  adjustNextFramePChar({ p5, nextPChar, neighbors }) {
    // adjust position of nextPChar
    return nextPChar;
  }

  dead() {
    return false;
  }

  finish() {
    return false;
  }
}
