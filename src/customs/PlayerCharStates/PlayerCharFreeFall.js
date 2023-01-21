import PlayerCharState from "./PlayerCharState";

export default class PlayerCharFreeFall extends PlayerCharState {
    constructor(pChar) {
        super(pChar);
    }

    updateAcceleration() {
        if (this.pChar.vY > 1000) {
            this.pChar.aY = 0;
        } else {
            this.pChar.aY = 2500;
        }
    }

    getNextFramePChar(FRAME_DURATION) {
        this.updateAcceleration();

        this.pChar.x += this.pChar.vX * FRAME_DURATION + 0.5 * this.pChar.aX * (FRAME_DURATION ** 2);
        this.pChar.vX += this.pChar.aX * FRAME_DURATION;
        this.pChar.y += this.pChar.vY * FRAME_DURATION + 0.5 * this.pChar.aY * (FRAME_DURATION ** 2);
        this.pChar.vY += this.pChar.aY * FRAME_DURATION;

        return this.pChar;
    }
}