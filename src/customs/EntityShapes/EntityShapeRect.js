import EntityShape from "./EntityShape";

export default class EntityShapeRect extends EntityShape {
  constructor(entity) {
    super(entity);
    this.alias = "rect";
  }

  getLargestLength() {
    return (this.entity.width ** 2 + this.entity.height ** 2) ** 0.5;
  }

  getTopMost() {
    return this.entity.y;
  }

  getBottomMost() {
    return this.entity.y + this.entity.height;
  }

  getLeftMost() {
    return this.entity.x;
  }

  getRightMost() {
    return this.entity.x + this.entity.width;
  }
}
