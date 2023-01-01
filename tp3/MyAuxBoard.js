import { MyTile } from "./MyTile.js";
import { MyPiece } from "./MyPiece.js";

class MyAuxBoard {
  constructor(scene, player) {
    this.pieces = [];
    this.player = player;
    this.offset = 0;
    if (player === "white") {
      this.offset = -4;
    } else {
      this.offset = 10;
    }

    this.scene = scene;
    this.board = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];

    this.createBoard();
    console.log(this.board);
  }

  createBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = new MyTile(
          this.scene,
          i * 6 + j,
          { x: j + this.offset, y: i },
          null
        );
      }
    }
  }

  addPiece(piece) {
    this.pieces.push(piece);

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j].getPiece() === null) {
          this.board[i][j].setPiece(piece);
          return;
        }
      }
    }
  }

  removePiece(tile) {
    for (let i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].getTile() === tile) {
        this.pieces.splice(i, 1);
        break;
      }
    }
    tile.setPiece(null);
  }

  display() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.scene.pushMatrix();
        this.board[i][j].display(false);
        this.scene.popMatrix();

        if (this.board[i][j].getPiece() !== null) {
          this.scene.pushMatrix();
          this.board[i][j].getPiece().display(false);
          this.scene.popMatrix();
        }
      }
    }
  }
}

export { MyAuxBoard };
