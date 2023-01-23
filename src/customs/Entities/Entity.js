import EntityShapeRect from "../EntityShapes/EntityShapeRect";
import EntityShapeTri from "../EntityShapes/EntityShapeTri";

export default class Entity {
  constructor({
    shapeAlias,
    type,
    penetrable,
    // everything in ppu
    x,
    x1,
    x2,
    x3,
    y,
    y1,
    y2,
    y3,
    width,
    height,
  }) {
    // check validity
    if (shapeAlias === "rect") {
      if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        console.error("invalid entity arguments");
        throw new Error("invalid entity arguments");
      }
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.shape = new EntityShapeRect(this);

      
    } else if (shapeAlias === "tri") {
      if (
        isNaN(x1) ||
        isNaN(x2) ||
        isNaN(x3) ||
        isNaN(y1) ||
        isNaN(y2) ||
        isNaN(y3) ||
        0.5 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) <= 0 // area <= 0
      ) {
        console.error("invalid entity arguments");
        throw new Error("invalid entity arguments");
      }
      this.x1 = this.x1;
      this.x2 = this.x2;
      this.x3 = this.x3;
      this.y1 = this.y1;
      this.y2 = this.y2;
      this.y3 = this.y3;
      this.x = this.x1;
      this.y = this.y1;
      this.shape = new EntityShapeTri(this);
    } else {
      console.error("unknown entity shape");
      throw new Error("unknown entity shape");
    }


    this.type = type;
    this.penetrable = penetrable;
  }

}
