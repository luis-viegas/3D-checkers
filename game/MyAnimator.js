class MyAnimator {
  constructor(game, gameSequence) {
    this.game = game;
    this.gameSequence = gameSequence;
    this.currentMove = 0;
  }
  reset() {
    this.currentMove = 0;
  }

  start() {
    this.gameSequence.moves.forEach((move) => {
      move.animate();
    });
  }

  display() {
    //TODO
  }
}

export { MyAnimator };
