import EntityShape from "./EntityShape";

export default class EntityShapeTri extends EntityShape {
  constructor(entity) {
    super(entity);
    this.alias = "tri";
  }

  getLargestLength() {
    const e = this.entity;
    const lengths = [
        ((e.x1 - e.x2) ** 2 + (e.y1 - e.y2) ** 2) ** 0.5,
        ((e.x2 - e.x3) ** 2 + (e.y2 - e.y3) ** 2) ** 0.5,
        ((e.x3 - e.x1) ** 2 + (e.y3 - e.y1) ** 2) ** 0.5
    ]
    return lengths.reduce((l, acc) => {
        return (l > acc) ? l : acc;
    });
  }

  getLeftMost() {
    const e = this.entity;
    return [e.x1, e.x2, e.x3].reduce((x, acc) => {
      return (x < acc) ? x : acc;
    });
  }

  getRightMost() {
    const e = this.entity;
    return [e.x1, e.x2, e.x3].reduce((x, acc) => {
      return (x > acc) ? x : acc;
    });
  }

  getTopMost() {
    const e = this.entity;
    return [e.y1, e.y2, e.y3].reduce((y, acc) => {
      return (y < acc) ? y : acc;
    });
  }

  getBottomMost() {
    const e = this.entity;
    return [e.y1, e.y2, e.y3].reduce((y, acc) => {
      return (y > acc) ? y : acc;
    });
  }
}
