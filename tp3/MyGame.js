import { MyBoard } from "./MyBoard.js";
import { MyGameSequence } from "./MyGameSequence.js";
import { MyAnimator } from "./MyAnimator.js";

class MyGame {
  constructor() {
    this.board = new MyBoard();
    this.gameSequence = new MyGameSequence();
    this.animator = new MyAnimator(this, this.gameSequence);
  }

  playMovie() {
    this.animator.start();
  }
}

let game = new MyGame();
game.board.printBoard();
console.log("Moving piece from (2,1) to (3,2)");
let tileOrigin = game.board.board[2][1];
let tileDesitination = game.board.board[3][2];
game.board.movePiece(tileOrigin.getPiece(), tileOrigin, tileDesitination);
game.board.printBoard();
