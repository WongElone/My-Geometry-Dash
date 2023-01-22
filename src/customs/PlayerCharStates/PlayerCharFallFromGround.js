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
    while (true) {
      const report = nextPChar.getCollisionReport({ p5, entities: neighbors});
      if (!report.collisions.length) break;
      nextPChar.rad += Math.PI / 180;
    }

    // new angular velocity
    nextPChar.vRad += (nextPChar.rad - oldRad) / FRAME_DURATION;

    return nextPChar;
  }
}
