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
    this.pChar.vY = -1000;
    this.pChar.aRad = 24 * Math.PI;
  }

  getNextFramePChar(FRAME_DURATION) { // frame duration = time taken for one frame
    const nextPChar = this.pChar;
    nextPChar.x += nextPChar.vX * FRAME_DURATION;
    nextPChar.y += nextPChar.vY * FRAME_DURATION;
    nextPChar.rad += nextPChar.vRad * FRAME_DURATION;
    return nextPChar;
  }

  adjustNextFramePChar({ p5, nextPChar, neighbors }) {
    while (true) {
      // check collision with non penetrable entities
      const result = nextPChar.getCollisionReport({ p5, entities: neighbors });
      // if no collision with non penetrable entities, set penetration to false
      if (!result.collisions.length) {
        break;
      }

      // if collided to any entity of die type, then no need to adjust position of pChar
      let breaker = false;
      for (let collision of result.collisions) {
        if (collision.entity.type === "die") breaker = true;
      }
      if (breaker) break;

      // adjust x, y, rad
      // nextPChar.x -= Math.sign(nextPChar.vX) * nextPChar.contactThreshold; // reduce x
      nextPChar.y -= Math.sign(nextPChar.vY) * nextPChar.contactThreshold; // reduce y
      nextPChar.rad -= Math.sign(nextPChar.vRad) * Math.PI / 180; // reduce one degree
    }
    return nextPChar;
  }
}
