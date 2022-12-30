class MyPiece {
  constructor(id = -1, type, tile = null) {
    this.id = id;
    this.type = type;
    this.tile = tile;
  }

  getType() {
    return this.type;
  }

  setType(type) {
    this.type = type;
  }

  display() {
    let result = "";
    this.type === "white" ? (result = "W") : (result = "B");
    return result;
  }
}

export { MyPiece };
