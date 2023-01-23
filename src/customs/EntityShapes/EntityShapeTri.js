import EntityShape from "./EntityShape";

export default class EntityShapeTri extends EntityShape {
  constructor(entity) {
    super(entity);
    if (entity.shape !== "tri") {
      console.error("unmatched entity shape");
      throw new Error("unmatched entity shape");
    }
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
}
