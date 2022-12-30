import { MyGameMove } from "./myGameMove.js";

class MyGameSequence {
  constructor() {
    this.moves = [];
  }

  addMove(move) {
    this.moves.push(move);
  }

  undoMove() {
    if (this.moves.length > 0) {
      let move = this.moves.pop();
      return move.board;
    }
  }

  getReplay() {
    return this.moves;
  }
}

export { MyGameSequence };
