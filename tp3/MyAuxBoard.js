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
        this.board[i][j].setBoardType("aux");
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

  getNextEmptyTile() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j].getPiece() === null) {
          return this.board[i][j];
        }
      }
    }
  }

  getLastAddedTile() {
    for (let i = this.board.length - 1; i >= 0; i--) {
      for (let j = this.board[i].length - 1; j >= 0; j--) {
        if (this.board[i][j].getPiece() !== null) {
          return this.board[i][j];
        }
      }
    }
  }

  removePiece(tile) {
    let piece;
    for (let i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].getTile() === tile) {
        piece = this.pieces.splice(i, 1);
        break;
      }
    }
    tile.setPiece(null);
  }

  removeLastPiece() {
    let piece;
    for (let i = this.pieces.length - 1; i >= 0; i--) {
      if (this.pieces[i].getTile() !== null) {
        this.pieces[i].getTile().setPiece(null);
        piece = this.pieces.splice(i, 1);
        break;
      }
    }

    return piece[0];
  }

  /**
   * If a piece was eaten in this move, returns one piece from this board to the main board
   * @param {MyGameMove} move
   */
  undoMove(move) {
    let pieceRemoved = null;
    if (move.pieceEaten !== undefined) {
      pieceRemoved = this.removeLastPiece();
    }
    return pieceRemoved;
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
