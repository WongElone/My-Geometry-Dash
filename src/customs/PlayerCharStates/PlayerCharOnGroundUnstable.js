import PlayerCharState from "./PlayerCharState";

export default class PlayerCharOnGroundUnstable extends PlayerCharState {
    constructor(pChar) {
        super(pChar);
        // if angle is smaller than 30 degree than rotate anticlockwise (negative vRad) about the point of touch
        // else rotate clockwise (positive vRad) about the point of touch
        this.pChar.aY = 0;
        this.pChar.vY = 0;
        this.pChar.aRad = 0;
    }

    jump() {
        this.pChar.vY = -1333;
        this.pChar.aRad = 24 * Math.PI;
        this.pChar.vRad = 0;
    }

    getNextFramePChar(FRAME_DURATION) {
        const nextPChar = this.pChar;
        if (nextPChar.vY === 0) { // no jump
            // get touching corner
            const oldContactVertice = nextPChar.getLowestVertice();
            // rotate around pivot at touching corner
            // if included angle between diagonal of contact and ground is positive
            let angleOfElevation = nextPChar.getAngleOfElevation();
            if (angleOfElevation < Math.PI / 3) {
                // clockwise rotation

                const angularDisplace = nextPChar.vRad * FRAME_DURATION;
                nextPChar.rad = (angularDisplace > angleOfElevation) ? 0 : nextPChar.rad + angularDisplace;
                // keep contact corner continuous contact
                nextPChar.y += oldContactVertice[1] - nextPChar.getLowestVertice()[1];
            } else {
                // anticlockwise rotation

                // nextPChar.rad = 0;
                // nextPChar.y += oldContactVertice[1] - nextPChar.getLowestVertice()[1];
                

                const angularDisplace = -1 * FRAME_DURATION;
                nextPChar.rad = (angularDisplace > (Math.PI * 0.5 - angleOfElevation)) ? 0 : nextPChar.rad + angularDisplace;
                // keep contact corner continuous contact
                nextPChar.y += oldContactVertice[1] - nextPChar.getLowestVertice()[1];
            }
            nextPChar.x += nextPChar.vX * FRAME_DURATION + 0.5 * nextPChar.aX * (FRAME_DURATION ** 2);
            nextPChar.vX += nextPChar.aX * FRAME_DURATION;

        } else { // jump
            nextPChar.x += nextPChar.vX * FRAME_DURATION + 0.5 * nextPChar.aX * (FRAME_DURATION ** 2);
            nextPChar.vX += nextPChar.aX * FRAME_DURATION;
            nextPChar.y += nextPChar.vY * FRAME_DURATION + 0.5 * nextPChar.aY * (FRAME_DURATION ** 2);
            nextPChar.vY += nextPChar.aY * FRAME_DURATION;
            nextPChar.rad += nextPChar.vRad * FRAME_DURATION + 0.5 * nextPChar.aRad * (FRAME_DURATION ** 2);
            nextPChar.vRad += nextPChar.aRad * FRAME_DURATION;
        }

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
            if (collision.entity.type === "die" || collision.entity.penetrable) breaker = true;
          }
          if (breaker) break;
    
          // adjust x, y, rad
          nextPChar.x -= Math.sign(nextPChar.vX) * nextPChar.contactThreshold; // reduce x
        //   nextPChar.y -= Math.sign(nextPChar.vY) * nextPChar.contactThreshold; // reduce y
          nextPChar.rad -= Math.sign(nextPChar.vRad) * Math.PI / 180; // reduce one degree
        }
        return nextPChar;
    }
}