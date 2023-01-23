export default class EntityShape {
  constructor(entity) {
    this.entity = entity;
    this.alias = null;
  }

  getLargestLength() {
    // return largest length
    // e.g. diagonal of rectangle
    // e.g. longest side of triangle
    console.error("method not yet overriden");
    throw new Error("method not yet overriden");
  }

  getTopMost() {
    // return y-level of highest point
    console.error("method not yet overriden");
    throw new Error("method not yet overriden");
  }

  getBottomMost() {
    // return y-level of lowest point
    console.error("method not yet overriden");
    throw new Error("method not yet overriden");
  }

  getLeftMost() {
    // return x-level of leftest point
    console.error("method not yet overriden");
    throw new Error("method not yet overriden");
  }

  getRightMost() {
    // return x-level of rightest point
    console.error("method not yet overriden");
    throw new Error("method not yet overriden");
  }
}
