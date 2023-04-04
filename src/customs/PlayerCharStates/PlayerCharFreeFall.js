import PlayerCharState from "./PlayerCharState";

export default class PlayerCharFreeFall extends PlayerCharState {
  constructor(pChar) {
    super(pChar);

    if (this.pChar.vY > 1500) {
      this.pChar.aY = 0;
    } else {
      this.pChar.aY = 3750;
    }

    if (this.pChar.vRad > 2 * Math.PI) {
      this.pChar.aRad = 0;
    }
  }

  getNextFramePChar(FRAME_DURATION) {
    const nextPChar = super.getNextFramePChar(FRAME_DURATION);
    nextPChar.x +=
      nextPChar.vX * FRAME_DURATION + 0.5 * nextPChar.aX * FRAME_DURATION ** 2;
    nextPChar.vX += nextPChar.aX * FRAME_DURATION;
    nextPChar.y +=
      nextPChar.vY * FRAME_DURATION + 0.5 * nextPChar.aY * FRAME_DURATION ** 2;
    nextPChar.vY += nextPChar.aY * FRAME_DURATION;
    nextPChar.rad +=
      nextPChar.vRad * FRAME_DURATION +
      0.5 * nextPChar.aRad * FRAME_DURATION ** 2;
    nextPChar.vRad += nextPChar.aRad * FRAME_DURATION;

    return nextPChar;
  }

  adjustNextFramePChar({ p5, nextPChar, neighbors }) {
    for (let n = 1; n < 999; n++) {
      // check collision with non penetrable entities
      const result = nextPChar.getCollisionReport({
        p5,
        entities: neighbors.filter((e) => !e.penetrable),
      });
      // if no collision with non penetrable entities, just break
      if (!result.collisions.length) {
        break;
      }

      // if collided to any entity of die type, then no need to adjust position of pChar
      for (let collision of result.collisions) {
        if (collision.entity.type === "die") return;
      }

      // adjust x, y, rad
      // nextPChar.x -= Math.sign(nextPChar.vX) * nextPChar.contactThreshold; // reduce x
      nextPChar.y -= Math.sign(nextPChar.vY) * nextPChar.contactThreshold; // reduce y
      nextPChar.rad -= (Math.sign(nextPChar.vRad) * Math.PI) / 180; // reduce one degree
    }
    return nextPChar;
  }
}
