import { MyTile } from "./MyTile.js";
import { MyPiece } from "./MyPiece.js";

class MyBoard {
  constructor(scene) {

    this.pieces = []

    this.scene = scene;
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
        this.board[i][j] = new MyTile(this.scene ,i * 8 + j, { x: j, y: i }, null);
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          let piece = new MyPiece(this.scene, i * 8 + j, "white", this.board[i][j] );
          this.pieces.push(piece);
          this.board[i][j].setPiece(piece);
        }
      }
    }
    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          let piece = new MyPiece(this.scene, i * 8 + j, "black", this.board[i][j]);
          this.pieces.push(piece);
          this.board[i][j].setPiece(piece);
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

  getTileByCoords(coords) {
    return this.board[coords.y][coords.x];
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
    return this.board[converted.y][converted.x];
  }

  movePiece(piece, startingTile, endingTile) {
    this.removePiece(startingTile);
    this.addPiece(piece, endingTile);
  }

  // Returns the distance between two tiles
  getTitleDistances(startTitle, endTitle) {
    let startCoords = startTitle.getCoords();
    let endCoords = endTitle.getCoords();
    let distance = { x: 0, y: 0 };
    distance.x = endCoords.x - startCoords.x;
    distance.y = endCoords.y - startCoords.y;
    return distance;
  }

  // Returns the tile closest to end tile between two tiles
  getTileBetween(startTile, endTile) {
    let distance = this.getTitleDistances(startTile, endTile);
    let tileBetween = null;
    if (distance.x >= 2 && distance.y >= 2) {
      tileBetween = this.board[endTile.getCoords().y - 1][endTile.getCoords().x - 1];
    } else if (distance.x <= -2 && distance.y >= 2) {
      tileBetween = this.board[endTile.getCoords().y - 1][endTile.getCoords().x + 1];
    } else if (distance.x >= 2 && distance.y <= -2) {
      tileBetween = this.board[endTile.getCoords().y + 1][endTile.getCoords().x - 1];
    } else if (distance.x <= -2 && distance.y <= -2) {
      tileBetween = this.board[endTile.getCoords().y + 1][endTile.getCoords().x + 1];
    }

    return tileBetween;
  }

  getPieceBetween(startTile, endTile) {
    let tileBetween = this.getTileBetween(startTile, endTile);
    if(tileBetween == null ) return null;
    return tileBetween.getPiece();
  }


  // Returns a boolean to check if there is a piece between two tiles
  isPieceBetween(startTile, endTile) {
    let tileBetween = this.getTileBetween(startTile, endTile);
    if(tileBetween == null ) return false; 
    if (tileBetween.getPiece() !== null) {
      return true;
    } else {
      return false;
    }
  }
  

  /**
   * High level function that returns an array with the available destinations for a piece
   *   
   * */

  getAvailableDestinations(piece) {
    let availableMoves = this.getAvailableMoves(this.getTile(piece), piece);
    return availableMoves;
  }

  /**
   * 
   * Returns an array with the available moves for a piece
   */
  getAvailableMoves(tile, piece) {
    let availableMoves = [];
    let pieceColor = piece.getType();
    let pieceCoords = tile.getCoords();
    let pieceX = pieceCoords.x;
    let pieceY = pieceCoords.y;

    //Game of chekers logic
    //TODO Add the logic for the other pieces
    if (pieceColor === "white") {
      if (pieceY < 7) {
        if (pieceX > 0) {
          if (this.board[pieceY + 1][pieceX - 1].getPiece() === null) {
            availableMoves.push(this.board[pieceY + 1][pieceX - 1]);
          }
          if (this.board[pieceY + 1][pieceX - 1].getPiece() !== null && this.board[pieceY + 1][pieceX - 1].getPiece().getType() !== pieceColor) {
            if (pieceY + 2 <= 7 && pieceX - 2 >= 0) {
              if (this.board[pieceY + 2][pieceX - 2].getPiece() === null) {
                availableMoves.push(this.board[pieceY + 2][pieceX - 2]);
              }
            }
          }
        }
        if (pieceX < 7) {
          if (this.board[pieceY + 1][pieceX + 1].getPiece() === null) {
            availableMoves.push(this.board[pieceY + 1][pieceX + 1]);
          }
          if (this.board[pieceY + 1][pieceX + 1].getPiece() !== null && this.board[pieceY + 1][pieceX + 1].getPiece().getType() !== pieceColor) {
            if (pieceY + 2 <= 7 && pieceX + 2 <= 7) {
              if (this.board[pieceY + 2][pieceX + 2].getPiece() === null) {
                availableMoves.push(this.board[pieceY + 2][pieceX + 2]);
              }
            }
          }
        }
      }
    }
    else {
      if (pieceY > 0) {
        if (pieceX > 0) {
          if (this.board[pieceY - 1][pieceX - 1].getPiece() === null) {
            availableMoves.push(this.board[pieceY - 1][pieceX - 1]);
          }
          if (this.board[pieceY - 1][pieceX - 1].getPiece() !== null && this.board[pieceY - 1][pieceX - 1].getPiece().getType() !== pieceColor) {
            if (pieceY - 2 >= 0 && pieceX - 2 >= 0) {
              if (this.board[pieceY - 2][pieceX - 2].getPiece() === null) {
                availableMoves.push(this.board[pieceY - 2][pieceX - 2]);
              }
            }
          }
        }
        if (pieceX < 7) {
          if (this.board[pieceY - 1][pieceX + 1].getPiece() === null) {
            availableMoves.push(this.board[pieceY - 1][pieceX + 1]);
          }
          if (this.board[pieceY - 1][pieceX + 1].getPiece() !== null && this.board[pieceY - 1][pieceX + 1].getPiece().getType() !== pieceColor) {
            if (pieceY - 2 >= 0 && pieceX + 2 <= 7) {
              if (this.board[pieceY - 2][pieceX + 2].getPiece() === null) {

                availableMoves.push(this.board[pieceY - 2][pieceX + 2]);
              }
            }
          }
        }
      }
      
    }

    return availableMoves;

  }


  //Verify if the piece can move and return the pieces the player can move
  getAvailablePieces(player) {
    let playerColor = player === 1 ?  "white" : "black";
    let availablePieces = [];
    for (let i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].getType() === playerColor) {
        availablePieces.push(this.pieces[i]);
      }
    }

    //Verify if the piece can move
    for (let i = availablePieces.length -1; i >= 0; i--) {
      let piece = availablePieces[i];
      let tile = this.getTile(piece);
      let availableMoves = this.getAvailableMoves(tile, piece);
      if (availableMoves.length === 0) {
        availablePieces.splice(i, 1);
      }
    }
    return availablePieces;
  }

  /**
   * Renders the board and the pieces
   */
  display() {

    for(let i = 0; i < this.board.length; i++){
      for(let j = 0; j < this.board[i].length; j++){
        this.scene.pushMatrix();

        if (this.scene.game.availableDestinations !== undefined){
          if(this.scene.game.availableDestinations.includes(this.board[i][j])){
            this.scene.registerForPick(this.board[i][j].id + 64, this.board[i][j]);
          }
        }

        this.board[i][j].display();
        this.scene.popMatrix();

        if(this.board[i][j].getPiece() !== null){
          this.scene.pushMatrix();
          if (this.scene.game.availablePieces !== undefined){
            if(this.scene.game.availablePieces.includes(this.board[i][j].getPiece())){
              this.scene.registerForPick(this.board[i][j].getPiece().id, this.board[i][j].getPiece());
            }
          }
          this.board[i][j].getPiece().display();

          this.scene.popMatrix();

        }
      }
    }
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
