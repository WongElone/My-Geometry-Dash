import EntityShapeRect from "../EntityShapes/EntityShapeRect";
import EntityShapeTri from "../EntityShapes/EntityShapeTri";

export default class Entity {
  constructor({
    shapeAlias,
    type,
    penetrable,
    p5_fill,
    p5_stroke,
    p5_strokeWeight,
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
        x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2) === 0 // 2 * area <= 0
      ) {
        console.error("invalid entity arguments");
        throw new Error("invalid entity arguments");
      }
      this.x1 = x1;
      this.x2 = x2;
      this.x3 = x3;
      this.y1 = y1;
      this.y2 = y2;
      this.y3 = y3;
      this.x = x1;
      this.y = y1;
      this.shape = new EntityShapeTri(this);
    } else {
      console.error("unknown entity shape");
      throw new Error("unknown entity shape");
    }


    this.type = type;
    this.penetrable = penetrable;
    this.p5_fill = p5_fill;
    this.p5_stroke = p5_stroke;
    this.p5_strokeWeight = p5_strokeWeight;
  }

}
