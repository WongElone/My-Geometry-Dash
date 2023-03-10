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
    const nextPChar = this.pChar;

    // fall
    nextPChar.x += nextPChar.vX * FRAME_DURATION + 0.5 * nextPChar.aX * (FRAME_DURATION ** 2);
    nextPChar.vX += nextPChar.aX * FRAME_DURATION;
    nextPChar.y += nextPChar.vY * FRAME_DURATION + 0.5 * nextPChar.aY * (FRAME_DURATION ** 2);
    nextPChar.vY += nextPChar.aY * FRAME_DURATION;
    nextPChar.rad += nextPChar.vRad * FRAME_DURATION;

    const oldRad = nextPChar.rad;

    // adjust rad
    let angleReverse = false;
    let loopCount = 0;
    while (loopCount < 9999) {
      loopCount += 1;
      const report = nextPChar.getCollisionReport({ p5, entities: neighbors});
      if (!report.collisions.length) break;

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

    // new angular velocity
    nextPChar.vRad += (nextPChar.rad - oldRad) / FRAME_DURATION;

    return nextPChar;
  }
}
