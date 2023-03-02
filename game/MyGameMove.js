class MyGameMove {
  constructor(board, piece, startingTile, endingTile, pieceEaten = undefined, pieceEatenTile = undefined, turnedKing = false) {
    this.board = board;
    this.piece = piece;
    this.startingTile = startingTile;
    this.endingTile = endingTile;
    this.pieceEaten = pieceEaten;
    this.pieceEatenTile = pieceEatenTile;
    this.turnedKing = false
  }

  turnKing(){
    this.turnedKing = true;
  }

  /**
   * 
   */
  debugPrint(){
    console.log("Piece Color: " + this.piece.getType());
    console.log("Starting tile: " + this.startingTile.getCoords().x + " " + this.startingTile.getCoords().y);
    console.log("Ending tile: " + this.endingTile.getCoords().x + " " + this.endingTile.getCoords().y);
    if(this.pieceEaten != undefined){
      console.log("Piece eaten: " + this.pieceEaten.getType());
      console.log("Piece eaten tile: " + this.pieceEatenTile.getCoords().x + " " + this.pieceEatenTile.getCoords().y);
    }
  }

  animate() {
    // TODO
  }
}

export { MyGameMove };
