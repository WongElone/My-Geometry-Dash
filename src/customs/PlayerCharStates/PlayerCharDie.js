import PlayerCharState from "./PlayerCharState";

export default class PlayerCharDie extends PlayerCharState {
    constructor(pChar) {
        super(pChar);
        this.pChar = pChar;
    }

    getNextFramePChar(FRAME_DURATION) {
        return this.pChar;
    }

    dead() {
        return true;
    }
}