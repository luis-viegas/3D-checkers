import { MyTile } from "./MyTile.js";
import { MyPiece } from "./MyPiece.js";

class MyBoard {
  constructor(scene) {
    this.pieces = [];

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
        this.board[i][j] = new MyTile(
          this.scene,
          i * 8 + j,
          { x: j, y: i },
          null
        );
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          let piece = new MyPiece(
            this.scene,
            i * 8 + j,
            "white",
            this.board[i][j]
          );
          this.pieces.push(piece);
          this.board[i][j].setPiece(piece);
        }
      }
    }
    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          let piece = new MyPiece(
            this.scene,
            i * 8 + j,
            "black",
            this.board[i][j]
          );
          this.pieces.push(piece);
          this.board[i][j].setPiece(piece);
        }
      }
    }
  }

  getMainBoardPieces() {
    let pieces = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j].getPiece() !== null) {
          pieces.push(this.board[i][j].getPiece());
        }
      }
    }
    return pieces;
  }



  addPiece(piece, tile) {
    tile.setPiece(piece);
  }

  removePiece(tile) {
    let id = tile.getPiece().id;
    tile.removePiece();
    for (let i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].id === id) {
        this.pieces.splice(i, 1);
        break;
      }
    }
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

  /**
   * Moves a piece from a tile to another tile
   * @param {MyPiece} piece 
   * @param {MyTile} startingTile 
   * @param {MyTile} endingTile 
   * returns true if the checker has turned into a king
   */
  movePiece(piece, startingTile, endingTile) {
    let hasTurned = false;
    this.removePiece(startingTile);
    //verify if piece is white and black and if it will become a king
    if (piece.getType() === "white" && endingTile.getCoords().y === 7) {
      piece.turnKing(true);
      hasTurned = true;
    } else if (piece.getType() === "black" && endingTile.getCoords().y === 0) {
      piece.turnKing(true);
      hasTurned = true;
    }

    this.addPiece(piece, endingTile);

    return hasTurned;

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
      tileBetween =
        this.board[endTile.getCoords().y - 1][endTile.getCoords().x - 1];
    } else if (distance.x <= -2 && distance.y >= 2) {
      tileBetween =
        this.board[endTile.getCoords().y - 1][endTile.getCoords().x + 1];
    } else if (distance.x >= 2 && distance.y <= -2) {
      tileBetween =
        this.board[endTile.getCoords().y + 1][endTile.getCoords().x - 1];
    } else if (distance.x <= -2 && distance.y <= -2) {
      tileBetween =
        this.board[endTile.getCoords().y + 1][endTile.getCoords().x + 1];
    }

    return tileBetween;
  }

  getPieceBetween(startTile, endTile) {
    let tileBetween = this.getTileBetween(startTile, endTile);
    if (tileBetween == null) return null;
    return tileBetween.getPiece();
  }

  // Returns a boolean to check if there is a piece between two tiles
  isPieceBetween(startTile, endTile) {
    let tileBetween = this.getTileBetween(startTile, endTile);
    if (tileBetween == null) return false;
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
    if (!piece.isKing) {
      if (pieceColor === "white") {
        if (pieceY < 7) {
          if (pieceX > 0 && this.board[pieceY + 1][pieceX - 1]!==undefined) {
            if (this.board[pieceY + 1][pieceX - 1].getPiece() === null) {
              availableMoves.push(this.board[pieceY + 1][pieceX - 1]);
            }
            if (
              this.board[pieceY + 1][pieceX - 1].getPiece() !== null &&
              this.board[pieceY + 1][pieceX - 1].getPiece().getType() !==
                pieceColor
            ) {
              if (pieceY + 2 <= 7 && pieceX - 2 >= 0) {
                if (this.board[pieceY + 2][pieceX - 2].getPiece() === null) {
                  availableMoves.push(this.board[pieceY + 2][pieceX - 2]);
                }
              }
            }
          }
          if (pieceX < 7 && this.board[pieceY + 1][pieceX + 1]!==undefined) {
            if (this.board[pieceY + 1][pieceX + 1].getPiece() === null) {
              availableMoves.push(this.board[pieceY + 1][pieceX + 1]);
            }
            if (
              this.board[pieceY + 1][pieceX + 1].getPiece() !== null &&
              this.board[pieceY + 1][pieceX + 1].getPiece().getType() !==
                pieceColor
            ) {
              if (pieceY + 2 <= 7 && pieceX + 2 <= 7) {
                if (this.board[pieceY + 2][pieceX + 2].getPiece() === null) {
                  availableMoves.push(this.board[pieceY + 2][pieceX + 2]);
                }
              }
            }
          }
        }
      } else {
        if (pieceY > 0) {
          if (pieceX > 0 && this.board[pieceY - 1][pieceX - 1]!==undefined) {
            if (this.board[pieceY - 1][pieceX - 1].getPiece() === null) {
              availableMoves.push(this.board[pieceY - 1][pieceX - 1]);
            }
            if (
              this.board[pieceY - 1][pieceX - 1].getPiece() !== null &&
              this.board[pieceY - 1][pieceX - 1].getPiece().getType() !==
                pieceColor
            ) {
              if (pieceY - 2 >= 0 && pieceX - 2 >= 0) {
                if (this.board[pieceY - 2][pieceX - 2].getPiece() === null) {
                  availableMoves.push(this.board[pieceY - 2][pieceX - 2]);
                }
              }
            }
          }
          if (pieceX < 7 && this.board[pieceY - 1][pieceX + 1]!==undefined) {
            if (this.board[pieceY - 1][pieceX + 1].getPiece() === null) {
              availableMoves.push(this.board[pieceY - 1][pieceX + 1]);
            }
            if (
              this.board[pieceY - 1][pieceX + 1].getPiece() !== null &&
              this.board[pieceY - 1][pieceX + 1].getPiece().getType() !==
                pieceColor
            ) {
              if (pieceY - 2 >= 0 && pieceX + 2 <= 7) {
                if (this.board[pieceY - 2][pieceX + 2].getPiece() === null) {
                  availableMoves.push(this.board[pieceY - 2][pieceX + 2]);
                }
              }
            }
          }
        }
      }

      //Will store the final moves after checking if there is a jump
      // If there is, only stores the possible jumps
      // Else stores all the available moves
      let finalMoves = [];

      //After returning all the available moves, detect if any of them is a jump
      for (let i = 0; i < availableMoves.length; i++) {
        let distance = {
          x: availableMoves[i].getCoords().x - pieceX,
          y: availableMoves[i].getCoords().y - pieceY,
        };
        if (Math.abs(distance.x) === 2 && Math.abs(distance.y) === 2) {
          finalMoves.push(availableMoves[i]);
        }
      }

      //If there is no jump, return all the available moves
      if (finalMoves.length === 0) {
        finalMoves = availableMoves;
      }

      return finalMoves;
    } else {
      //The piece is a king so can move in all four directions
      //Check if there is a piece in the way
      //If there is, check if there is a free tile after the piece
      //If there is, add the tile to the available moves
      //If there is not, do not add the tile to the available moves

      let directions = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
      ];

      let jumpMoves = [];

      for (let i = 0; i < directions.length; i++) {
        let x = pieceX + directions[i].x;
        let y = pieceY + directions[i].y;
        while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
          if (this.board[y][x].getPiece() === null) {
            availableMoves.push(this.board[y][x]);
          } else {
            if (this.board[y][x].getPiece().getType() === pieceColor) {
              break;
            }
            let x2 = x + directions[i].x;
            let y2 = y + directions[i].y;
            if (x2 >= 0 && x2 <= 7 && y2 >= 0 && y2 <= 7) {
              if (this.board[y2][x2].getPiece() === null) {
                availableMoves.push(this.board[y2][x2]);
                jumpMoves.push(this.board[y2][x2]);
              }
            }
            break;
          }
          x += directions[i].x;
          y += directions[i].y;
        }
      }

      //If he has jump moves, return only the jump moves
      if (jumpMoves.length > 0) {
        return jumpMoves;
      }

      return availableMoves;
    }
  }

  //Verify if the piece can move and return the pieces the player can move
  getAvailablePieces(player) {
    let playerColor = player === 1 ? "white" : "black";
    //stores pre-verified pieces that can move
    let availablePieces = [];
    //stores the final pieces that can move and obligates to eat
    let finalAvailablePieces = [];

    let pieces = this.getMainBoardPieces();

    for (let i = 0; i < pieces.length; i++) {
      if (
        pieces[i].getType() === playerColor &&
        pieces[i].getTile() !== null
      ) {
        availablePieces.push(pieces[i]);
      }
    }

    //Verify if the piece can move
    for (let i = availablePieces.length - 1; i >= 0; i--) {
      let piece = availablePieces[i];
      let tile = this.getTile(piece);
      let availableMoves = this.getAvailableMoves(tile, piece);
      //Verify if the moves are jumps
      let isJump = false;
      for (let j = 0; j < availableMoves.length; j++) {
        let distance = {
          x: availableMoves[j].getCoords().x - tile.getCoords().x,
          y: availableMoves[j].getCoords().y - tile.getCoords().y,
        };
        if (
          Math.abs(distance.x) === 2 &&
          Math.abs(distance.y) === 2 &&
          !piece.isKing
        ) {
          isJump = true;
        }
        if (piece.isKing && this.isPieceBetween(tile, availableMoves[j])) {
          isJump = true;
        }
      }
      //If the piece can move and it is a jump, add it to the final pieces
      if (availableMoves.length > 0 && isJump) {
        finalAvailablePieces.push(piece);
      }

      if (availableMoves.length === 0) {
        availablePieces.splice(i, 1);
      }
    }


    //If there is no jump, return all the available pieces
    if (finalAvailablePieces.length === 0) {
      finalAvailablePieces = availablePieces;
    }

    return finalAvailablePieces;
  }

  /**
   * Renders the board and the pieces
   */
  display() {
    this.scene.clearPickRegistration();

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        let pickable = false;
        this.scene.pushMatrix();

        if (this.scene.game.availableDestinations !== undefined) {
          if (
            this.scene.game.availableDestinations.includes(this.board[i][j])
          ) {
            pickable = true;
          }
        }

        this.board[i][j].display(pickable);
        this.scene.popMatrix();

        if (this.board[i][j].getPiece() !== null) {
          pickable = false;
          this.scene.pushMatrix();
          if (this.scene.game.availablePieces !== undefined) {
            if (
              this.scene.game.availablePieces.includes(
                this.board[i][j].getPiece()
              )
            ) {
              pickable = true;
            }
          }
          this.board[i][j].getPiece().display(pickable);

          this.scene.popMatrix();
        }
      }
    }
  }

  /**
   * Undoes the last Move made
   * @param {*} move 
   */
  undoMove(move){
    this.movePiece(move.piece, move.endingTile, move.startingTile);

    //Verify if the piece was turned into a king last move and turn it back
    if(move.turnKing == true){
      move.piece.isKing = false;
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
