import { MyGameMove } from "./myGameMove.js";

class MyGameSequence {
  constructor() {
    this.moves = [];
  }

  addMove(move) {
    this.moves.push(move);
    move.debugPrint()
  }

  undoMove() {
    if (this.moves.length > 0) {
      let move = this.moves.pop();
      return move;
    }

    return null
  }

  getReplay() {
    return this.moves;
  }
}

export { MyGameSequence };
