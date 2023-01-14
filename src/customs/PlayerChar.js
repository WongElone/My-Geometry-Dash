export default class PlayerChar {
  constructor({ x, y, rad, width }) {
    this.x = x; // in ppu
    this.y = y; // in ppu
    this.rad = rad; // in rad
    this.width = width; // in block unit
  }

  getVerticesPpu(displaceX = 0, displaceY = 0) {
    // get vertices in ppu
    const halfDiagonal = this.width * 2 ** -0.5;
    return [
      this.x + displaceX + halfDiagonal * Math.cos(this.rad),
      this.y + displaceY + halfDiagonal * Math.sin(this.rad), // radian anticlockwise in cartisian coordinate = clockwise in canvas
      this.x + displaceX + halfDiagonal * Math.cos(this.rad + Math.PI / 2),
      this.y + displaceY + halfDiagonal * Math.sin(this.rad + Math.PI / 2), // radian anticlockwise in cartisian coordinate = clockwise in canvas
      this.x + displaceX + halfDiagonal * Math.cos(this.rad + Math.PI),
      this.y + displaceY + halfDiagonal * Math.sin(this.rad + Math.PI), // radian anticlockwise in cartisian coordinate = clockwise in canvas
      this.x + displaceX + halfDiagonal * Math.cos(this.rad + (Math.PI * 3) / 2),
      this.y + displaceY + halfDiagonal * Math.sin(this.rad + (Math.PI * 3) / 2), // radian anticlockwise in cartisian coordinate = clockwise in canvas
    ];
  }
}
