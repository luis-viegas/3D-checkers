
class MyPiece {
  constructor(scene, id = -1, type, tile = null) {
    this.scene = scene;
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

  setTile(tile) {
    this.tile = tile;
  }

  getTile() {
    return this.tile;
  }


  print() {
    let result = "";
    this.type === "white" ? (result = "W") : (result = "B");
    return result;
  }

  display(pickable = false) {
    this.scene.pushMatrix();
    this.scene.translate(this.tile.coords.x, 0, -1 * this.tile.coords.y);
    this.scene.multMatrix(this.scene.graph.components["piece"].transformation);

    if (pickable) {
      this.scene.registerForPick(this.id, this);
      this.scene.graph.appearences["highlight"].apply();
    }
    else{
      this.scene.registerForPick(-1, this);
      this.scene.graph.appearences[this.type].apply();
    }
 

    for (
      let j = 0;
      j < this.scene.graph.components["piece"].primitives.length;
      j++
    ) {
      this.scene.graph.components["piece"].primitives[j].display();
    }



    this.scene.popMatrix();
  }
}

export { MyPiece };
