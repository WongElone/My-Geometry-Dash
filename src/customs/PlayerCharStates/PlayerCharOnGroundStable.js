import PlayerCharState from "./PlayerCharState";

export default class PlayerCharOnGroundStable extends PlayerCharState {
    constructor(pChar) {
        super(pChar);
        this.accelX = 0;
        this.accelY = 0;
    }

    jump() {
        this.pChar.vY = 9.81;
    }

    rotate() {
        // if one corner on ground, then rotate until two corner on ground
        // else don't rotate
    }

    getNextFramePChar() {
        
    }
}