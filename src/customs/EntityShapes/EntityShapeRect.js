import EntityShape from "./EntityShape";

export default class EntityShapeRect extends EntityShape {
  constructor(entity) {
    super(entity);
    if (entity.shape !== "rect") {
        console.error("unmatched entity shape");
        throw new Error("unmatched entity shape");
    }
  }

  getLargestLength() {
    return (this.entity.width ** 2 + this.entity.height ** 2) ** 0.5;
  }
}
