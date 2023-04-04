import PlayerCharState from "./PlayerCharState";

export default class PlayerCharFallFromGround extends PlayerCharState {
  constructor(pChar) {
    super(pChar);
    this.pChar.aY = 2500;
    this.pChar.aRad = 0;
    if (this.pChar.vRad < 0 || this.pChar.isParallel()) {
      this.pChar.vRad = 0;
    }
  }

  getNextFramePChar(FRAME_DURATION, { p5, neighbors }) {
    const nextPChar = super.getNextFramePChar(FRAME_DURATION);

    // fall
    nextPChar.x += nextPChar.vX * FRAME_DURATION + 0.5 * nextPChar.aX * (FRAME_DURATION ** 2);
    nextPChar.vX += nextPChar.aX * FRAME_DURATION;
    nextPChar.y += nextPChar.vY * FRAME_DURATION + 0.5 * nextPChar.aY * (FRAME_DURATION ** 2);
    nextPChar.vY += nextPChar.aY * FRAME_DURATION;
    nextPChar.rad += nextPChar.vRad * FRAME_DURATION;

    const oldRad = nextPChar.rad;

    // adjust rad
    let angleReverse = false;
    let breaker = false;
    for (let n = 0; n < 9; n ++) {
      for (let m = 0; m < 361; m ++) {
        // check collision with non penetrable entities
        const report = nextPChar.getCollisionReport({ p5, entities: neighbors.filter(e => !e.penetrable) });
        // if no collision with non penetrable entities, just break
        if (!report.collisions.length) {
          breaker = true;
          break;
        }

        if (nextPChar.rad - oldRad > Math.PI * 0.5) {
          angleReverse = true;
          nextPChar.rad = oldRad - Math.PI / 180;
          continue;
        }

        if (angleReverse) {
          nextPChar.rad -= Math.PI / 180;
        } else {
          nextPChar.rad += Math.PI / 180;
        }
      }
      if (breaker) break;
      // nextPChar.y -= 0.1 * nextPChar.vY; // reduce y
      nextPChar.y -= Math.sign(nextPChar.vY) * nextPChar.contactThreshold; // reduce y
    }

    // new angular velocity
    nextPChar.vRad += (nextPChar.rad - oldRad) / FRAME_DURATION;

    return nextPChar;
  }
}
