import { MyTile } from "./MyTile.js";
import { MyPiece } from "./MyPiece.js";

class MyBoard {
  constructor() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    this.createBoard();
  }

  createBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = new MyTile(i * 8 + j, { x: i, y: j }, null);
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          this.board[i][j].setPiece(new MyPiece(i * 8 + j, "white"));
        }
      }
    }
    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          this.board[i][j].setPiece(new MyPiece(i * 8 + j, "black"));
        }
      }
    }
  }

  addPiece(piece, tile) {
    tile.setPiece(piece);
  }

  removePiece(tile) {
    tile.removePiece();
  }

  getPiece(tile) {
    return tile.getPiece();
  }

  getTile(piece) {
    return piece.getTile();
  }

  convertCoords(coords) {
    let converted = { x: 0, y: 0 };
    switch (coords.x) {
      case "A":
        converted.x = 0;
        break;
      case "B":
        converted.x = 1;
        break;
      case "C":
        converted.x = 2;
        break;
      case "D":
        converted.x = 3;
        break;
      case "E":
        converted.x = 4;
        break;
      case "F":
        converted.x = 5;
        break;
      case "G":
        converted.x = 6;
        break;
      case "H":
        converted.x = 7;
        break;
    }
    converted.y = 8 - coords.y;
    return converted;
  }

  getTileCoords(coords) {
    let converted = this.convertCoords(coords);
    return this.board[converted.x][converted.y];
  }

  movePiece(piece, startingTile, endingTile) {
    this.removePiece(startingTile);
    this.addPiece(piece, endingTile);
  }

  // for debug puposes
  printBoard() {
    let stringbuilder = "";
    for (let i = 0; i < this.board.length; i++) {
      let row = "";
      for (let j = 0; j < this.board[i].length; j++) {
        row += this.board[i][j].display() + " ";
      }
      stringbuilder += row + "\n";
    }
    console.log(stringbuilder);
  }
}

export { MyBoard };
