import PlayerCharState from "./PlayerCharState";

export default class PlayerCharOnGroundStable extends PlayerCharState {
  constructor(pChar) {
    super(pChar);
    this.pChar.aY = 0;
    this.pChar.vY = 0;
    this.pChar.aRad = 0;
    this.pChar.vRad = 0;
  }

  jump() {
    this.pChar.vY = -1500;
    this.pChar.aRad = 24 * Math.PI;
  }

  getNextFramePChar(FRAME_DURATION) { // frame duration = time taken for one frame
    const nextPChar = super.getNextFramePChar(FRAME_DURATION);
    nextPChar.x += nextPChar.vX * FRAME_DURATION;
    nextPChar.y += nextPChar.vY * FRAME_DURATION;
    nextPChar.rad += nextPChar.vRad * FRAME_DURATION;
    return nextPChar;
  }

  adjustNextFramePChar({ p5, nextPChar, neighbors }) {
    for (let n = 1; n < 999; n ++) {
      // check collision with non penetrable entities
      const result = nextPChar.getCollisionReport({ p5, entities: neighbors.filter(e => !e.penetrable) });
      // if no collision with non penetrable entities, just break
      if (!result.collisions.length) {
        break;
      }

      // if collided to any entity of die type, then no need to adjust position of pChar
      for (let collision of result.collisions) {
        if (collision.entity.type === "die") return;
      }

      // adjust x, y, rad
      nextPChar.x -= Math.sign(nextPChar.vX) * nextPChar.contactThreshold; // reduce x
      nextPChar.y -= Math.sign(nextPChar.vY) * nextPChar.contactThreshold; // reduce y
      // nextPChar.rad -= Math.sign(nextPChar.vRad) * Math.PI / 180; // reduce one degree
    }
    return nextPChar;
  }
}
