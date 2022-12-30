import { MyPiece } from "./MyPiece.js";

class MyTile {
  constructor(id = -1, coords = { x: 0, y: 0 }, piece = null) {
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
  }
  removePiece() {
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

  display() {
    if (this.piece === null) {
      return " ";
    }
    return this.piece.display();
  }
}

export { MyTile };
