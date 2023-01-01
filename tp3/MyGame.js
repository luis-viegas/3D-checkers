import { MyBoard } from "./MyBoard.js";
import { MyGameSequence } from "./MyGameSequence.js";
import { MyAnimator } from "./MyAnimator.js";
import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";
import { MyAuxBoard } from "./MyAuxBoard.js";

const gameState = {
  NotStarted: "NotStarted",
  Player1PickingPiece: "Player1PickingPiece",
  Player2PickingPiece: "Player2PickingPiece",
  Player1PickingDestination: "Player1PickingDestination",
  Player2PickingDestination: "Player2PickingDestination",
  Player1MovingPiece: "Player1MovingPiece",
  Player2MovingPiece: "Player2MovingPiece",
  GameEnded: "GameEnded",
};

class MyGame {
  constructor(scene) {
    this.state = gameState.NotStarted;
    this.scene = scene;
    this.board = new MyBoard(scene, this);
    this.whiteAuxBoard = new MyAuxBoard(scene, "white");
    this.blackAuxBoard = new MyAuxBoard(scene, "black");
    this.gameSequence = new MyGameSequence();
    this.animator = new MyAnimator(this, this.gameSequence);

    this.selectedPiece = undefined;
    this.selectedDestination = undefined;
    this.availablePieces = undefined;
    this.availableDestinations = undefined;
    this.pieceEaten = undefined;
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
    this.updateGameState();
  }

  updateGameState() {
    switch (this.state) {
      case gameState.NotStarted:
        this.scene.setPickEnabled(false);
        break;
      case gameState.Player1PickingPiece:
        this.scene.setPickEnabled(true);
        this.availablePieces = this.board.getAvailablePieces(1);

        break;
      case gameState.Player2PickingPiece:
        this.scene.setPickEnabled(true);
        this.availablePieces = this.board.getAvailablePieces(2);
        break;
      case gameState.Player1PickingDestination:
        this.scene.setPickEnabled(true);
        this.availableDestinations = this.board.getAvailableDestinations(
          this.selectedPiece
        );
        break;
      case gameState.Player2PickingDestination:
        this.scene.setPickEnabled(true);
        this.availableDestinations = this.board.getAvailableDestinations(
          this.selectedPiece
        );
        break;

      case gameState.Player1MovingPiece:
        this.scene.setPickEnabled(false);
        //Animate piece
        this.board.movePiece(
          this.selectedPiece,
          this.board.getTile(this.selectedPiece),
          this.selectedDestination
        );
        if (this.pieceEaten != undefined) {
          this.board.removePiece(this.pieceEaten.getTile());
          this.blackAuxBoard.addPiece(this.pieceEaten);
          this.selectedPiece = this.board
            .getTileByCoords(this.selectedDestination.coords)
            .getPiece();
          this.pieceEaten = undefined;
          this.availablePieces = undefined;
          this.availableDestinations = undefined;
          this.selectedDestination = undefined;

          let availableDestinations = this.board.getAvailableDestinations(
            this.selectedPiece
          );
          for (let i = 0; i < availableDestinations.length; i++) {
            if (
              this.board.isPieceBetween(
                this.selectedPiece.getTile(),
                availableDestinations[i]
              )
            ) {
              this.setState(gameState.Player1PickingDestination);
              return;
            }
          }
        }
        this.selectedPiece = undefined;
        this.availablePieces = undefined;
        this.availableDestinations = undefined;
        this.selectedDestination = undefined;
        this.setState(gameState.Player2PickingPiece);

        break;
      case gameState.Player2MovingPiece:
        this.scene.setPickEnabled(false);
        //Animate piece
        this.board.movePiece(
          this.selectedPiece,
          this.board.getTile(this.selectedPiece),
          this.selectedDestination
        );
        if (this.pieceEaten != undefined) {
          this.board.removePiece(this.pieceEaten.getTile());
          this.whiteAuxBoard.addPiece(this.pieceEaten);
          this.selectedPiece = this.board
            .getTileByCoords(this.selectedDestination.coords)
            .getPiece();
          this.pieceEaten = undefined;
          this.availablePieces = undefined;
          this.availableDestinations = undefined;
          this.selectedDestination = undefined;

          let availableDestinations = this.board.getAvailableDestinations(
            this.selectedPiece
          );
          for (let i = 0; i < availableDestinations.length; i++) {
            if (
              this.board.isPieceBetween(
                this.selectedPiece.getTile(),
                availableDestinations[i]
              )
            ) {
              this.setState(gameState.Player2PickingDestination);
              return;
            }
          }
        }

        this.selectedPiece = undefined;
        this.availablePieces = undefined;
        this.availableDestinations = undefined;
        this.selectedDestination = undefined;

        this.setState(gameState.Player1PickingPiece);
        break;
      case gameState.GameEnded:
        this.scene.setPickEnabled(false);
        break;
    }
  }

  managePick(mode, results) {
    if (mode == false /* && some other game conditions */) {
      if (results != null && results.length > 0) {
        // any results?
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
          var obj = results[i][0]; // get object from result
          if (obj) {
            // exists?
            var uniqueId = results[i][1]; // get id
            this.onObjectSelected(obj, uniqueId);
          }
        }
        // clear results
        results.splice(0, results.length);
      }
    }
  }

  onObjectSelected(obj, id) {
    switch (this.state) {
      case gameState.Player1PickingPiece:
        if (obj instanceof MyPiece) {
          this.selectedPiece = obj;
          this.setState(gameState.Player1PickingDestination);
        }
        break;
      case gameState.Player2PickingPiece:
        if (obj instanceof MyPiece) {
          this.selectedPiece = obj;
          this.setState(gameState.Player2PickingDestination);
        }
        break;
      case gameState.Player1PickingDestination:
        if (obj instanceof MyPiece) {
          this.selectedPiece = obj;
          this.setState(gameState.Player1PickingDestination);
        }
        if (obj instanceof MyTile) {
          this.selectedDestination = obj;
          if (this.availablePieces == undefined) {
            if (
              !this.board.isPieceBetween(
                this.selectedPiece.getTile(),
                this.selectedDestination
              )
            ) {
              return;
            }
          }
          if (
            this.board.isPieceBetween(
              this.selectedPiece.getTile(),
              this.selectedDestination
            )
          ) {
            this.pieceEaten = this.board.getPieceBetween(
              this.selectedPiece.getTile(),
              this.selectedDestination
            );
          }
          this.setState(gameState.Player1MovingPiece);
        }

        break;
      case gameState.Player2PickingDestination:
        if (obj instanceof MyPiece) {
          this.selectedPiece = obj;
          this.setState(gameState.Player2PickingDestination);
        }
        if (obj instanceof MyTile) {
          this.selectedDestination = obj;
          if (this.availablePieces == undefined) {
            if (
              !this.board.isPieceBetween(
                this.selectedPiece.getTile(),
                this.selectedDestination
              )
            ) {
              return;
            }
          }
          if (
            this.board.isPieceBetween(
              this.selectedPiece.getTile(),
              this.selectedDestination
            )
          ) {
            this.pieceEaten = this.board.getPieceBetween(
              this.selectedPiece.getTile(),
              this.selectedDestination
            );
          }
          this.setState(gameState.Player2MovingPiece);
        }

        break;
    }
  }

  playMovie() {
    this.animator.start();
  }

  display() {
    this.scene.pushMatrix();
    this.board.display();
    this.whiteAuxBoard.display();
    this.blackAuxBoard.display();
    this.scene.popMatrix();
  }
}

export { MyGame, gameState };

/*
let game = new MyGame();
game.board.printBoard();
console.log("Moving piece from (2,1) to (3,2)");
let tileOrigin = game.board.board[2][1];
let tileDesitination = game.board.board[3][2];
game.board.movePiece(tileOrigin.getPiece(), tileOrigin, tileDesitination);
game.board.printBoard();
*/
