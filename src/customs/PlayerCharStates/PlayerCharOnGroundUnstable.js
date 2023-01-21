import PlayerCharState from "./PlayerCharState";

export default class PlayerCharOnGroundUnstable extends PlayerCharState {
    constructor(pChar) {
        super(pChar);
    }

    jump() {
        this.pChar.vY = 9.81;
    }
}