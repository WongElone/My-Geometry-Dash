import PlayerCharState from "./PlayerCharState";

export default class PlayerCharFreeFall extends PlayerCharState {
    constructor(pChar) {
        super(pChar);
        this.accelX = 0;
        this.accelY = -9.81;
    }
}