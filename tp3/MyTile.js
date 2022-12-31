import { MyPiece } from "./MyPiece.js";

class MyTile {
  constructor(scene, id = -1, coords = { x: 0, y: 0 }, piece = null) {
    this.scene = scene
    this.id = id;
    this.coords = coords;
    this.piece = piece;
    this.mainBoard = true;
  }

  getPiece() {
    return this.piece;
  }
  setPiece(piece) {
    this.piece = piece;
    this.piece.setTile(this);
  }
  removePiece() {
    this.piece.setTile(null)  
    this.piece = null;
  }
  moveMainBoard() {
    this.mainBoard = true;
  }
  moveAuxBoard() {
    this.mainBoard = false;
  }

  getTileColor() {
    return (this.coords.x + this.coords.y) % 2 === 0 ? "white" : "black";
  }

  getCoords() {
    return this.coords;
  }

  print() {
    if (this.piece === null) {
      return " ";
    }
    return this.piece.print();
  }

  display(pickable) {
    this.scene.pushMatrix();
    this.scene.translate(this.coords.x, 0, -1* this.coords.y);
    this.scene.multMatrix(this.scene.graph.components["tile"].transformation);

    if(pickable) {
      this.scene.registerForPick(this.id + 64, this);
      //Applies the highlight appearance to the tile
      this.scene.graph.appearences["highlight"].apply();
    }
    else{
      this.scene.registerForPick(-1, this);
      //Applies the white or black appearance to the tile
      if(this.getTileColor() === "white") {
        this.scene.graph.appearences["white"].apply();
      } else {
        this.scene.graph.appearences["black"].apply();
      }
    }

    for (let j = 0; j < this.scene.graph.components["tile"].primitives.length; j++) {
      this.scene.graph.components["tile"].primitives[j].display();
    }

    this.scene.popMatrix();
  }
}

export { MyTile };
