import PlayerCharState from "./PlayerCharState";

export default class PlayerCharOnGroundStable extends PlayerCharState {
  constructor(pChar) {
    super(pChar);
    this.pChar.aY = 0;
    this.pChar.vY = 0;
    this.pChar.aRad = 0;
    this.pChar.vRad = 0;
  }

  jump() {
    this.pChar.vY = -1000;
  }
}
