import { MyBoard } from "./MyBoard.js";
import { MyGameSequence } from "./MyGameSequence.js";
import { MyGameMove } from "./MyGameMove.js";
import { MyAnimator } from "./MyAnimator.js";
import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";
import { MyAuxBoard } from "./MyAuxBoard.js";
import { MySimpleAnimation } from "./MySimpleAnimation.js";
import { MyCircularAnimation } from "./MyCircularAnimation.js";

const gameState = {
  NotStarted: "NotStarted",
  Player1PickingPiece: "Player1PickingPiece",
  Player2PickingPiece: "Player2PickingPiece",
  Player1PickingDestination: "Player1PickingDestination",
  Player2PickingDestination: "Player2PickingDestination",
  Player1MovingPiece: "Player1MovingPiece",
  Player2MovingPiece: "Player2MovingPiece",
  Player1Winner: "Player1Winner",
  Player2Winner: "Player2Winner",
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
    let move, pieceEatenTile, fromPos, toPos, animation;

    switch (this.state) {
      case gameState.NotStarted:
        this.scene.setPickEnabled(true);
        break;
      case gameState.Player1PickingPiece:
        //Verify if there are any available pieces to play
        //If not, end the game and declare the winner
        if (this.board.getAvailablePieces(1).length === 0) {
          this.setState(gameState.Player2Winner);
          return;
        }
        this.scene.setPickEnabled(true);
        this.availablePieces = this.board.getAvailablePieces(1);

        break;
      case gameState.Player2PickingPiece:
        if (this.board.getAvailablePieces(2).length === 0) {
          this.setState(gameState.Player1Winner);
          return;
        }
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

        //Create SimpleAnimation for piece
        pieceEatenTile =
          this.pieceEaten == undefined ? undefined : this.pieceEaten.getTile();

        this.move = new MyGameMove(
          this.board,
          this.selectedPiece,
          this.selectedPiece.getTile(),
          this.selectedDestination,
          this.pieceEaten,
          pieceEatenTile
        );

        fromPos = this.selectedPiece.getTile().getDisplayCoords();
        toPos = this.selectedDestination.getDisplayCoords();

        animation = new MySimpleAnimation(this.scene, fromPos, toPos, 500);
        this.selectedPiece.setAnimation(animation);
        break;

      case gameState.Player2MovingPiece:
        this.scene.setPickEnabled(false);

        //Create SimpleAnimation for piece
        pieceEatenTile =
          this.pieceEaten == undefined ? undefined : this.pieceEaten.getTile();

        this.move = new MyGameMove(
          this.board,
          this.selectedPiece,
          this.selectedPiece.getTile(),
          this.selectedDestination,
          this.pieceEaten,
          pieceEatenTile
        );

        fromPos = this.selectedPiece.getTile().getDisplayCoords();
        toPos = this.selectedDestination.getDisplayCoords();

        animation = new MySimpleAnimation(this.scene, fromPos, toPos, 500);
        this.selectedPiece.setAnimation(animation);
        break;
      case gameState.Player1Winner:
        this.scene.setPickEnabled(false);
        alert("White Pieces win!");
        this.setState(gameState.NotStarted);
        this.reset();
        break;
      case gameState.Player2Winner:
        this.scene.setPickEnabled(false);
        alert("Black Pieces win!");
        this.setState(gameState.NotStarted);
        this.reset();
        break;
    }
  }

  /**
   * Manage Pick resutls
   * @param {boolean} mode
   * @param {Array(id, object)} results
   */
  managePick(mode, results) {
    if (mode == false /* && some other game conditions */) {
      if (results != null && results.length > 0) {
        // any results?
        for (var i = 0; i < results.length; i++) {
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

    if (id === 1000) {
      this.scene.undoMove();
    }

    if (id === 1001 || id === 1002 || id === 1003) {
      let cameras = {
        1001: "whiteCamera",
        1002: "blackCamera",
        1003: "middleCamera",
      };
      this.scene.updateCamera(cameras[id]);
    }

    console.log("Selected object: " + obj + ", with pick id " + id);
  }

  detectCollision(piece1Pos, piece2Pos, pieceRadius = 0.5) {
    return (
      Math.sqrt(
        Math.pow(piece1Pos[0] - piece2Pos[0], 2) +
          Math.pow(piece1Pos[1] - piece2Pos[1], 2) +
          Math.pow(piece1Pos[2] - piece2Pos[2], 2)
      ) < pieceRadius
    );
  }

  /**
   * Depending on game state, manages the animations of the game elements and the consequences
   * @param {integer} deltaTime
   * @returns
   */
  ongoingStateUpdate(deltaTime) {
    let pos,
      animationPos,
      eatenPiece,
      collision = false;

    switch (this.state) {
      case gameState.Player1PickingPiece:
        if (
          this.lastMove != undefined &&
          this.lastMove.piece.animation != undefined
        ) {
          this.lastMove.piece.animation.update(deltaTime);
          if (this.lastMove.piece.animation.isOver()) {
            this.board.undoMove(this.lastMove);
            this.lastMove.piece.animation = undefined;

            //Animation of the piece that was eaten

            if (this.lastMove.pieceEaten == undefined) {
              this.setState(gameState.Player2PickingPiece);
              this.lastMove = undefined;
            } else if (this.lastMove.pieceEaten.getType() == "white") {
              this.lastMove.pieceEaten.animation = new MyCircularAnimation(
                this.scene,
                this.whiteAuxBoard.getLastAddedTile().getDisplayCoords(),
                this.lastMove.pieceEatenTile.getDisplayCoords(),
                1000,
                false
              );
            } else if (this.lastMove.pieceEaten.getType() == "black") {
              this.lastMove.pieceEaten.animation = new MyCircularAnimation(
                this.scene,
                this.blackAuxBoard.getLastAddedTile().getDisplayCoords(),
                this.lastMove.pieceEatenTile.getDisplayCoords(),
                1000,
                false
              );
            }
          }
        } else if (
          this.lastMove != undefined &&
          this.lastMove.pieceEaten != undefined &&
          this.lastMove.pieceEaten.animation != undefined
        ) {
          this.lastMove.pieceEaten.animation.update(deltaTime);
          if (this.lastMove.pieceEaten.animation.isOver()) {
            this.lastMove.pieceEaten.animation = undefined;
            if (this.lastMove.pieceEaten.getType() == "white")
              eatenPiece = this.whiteAuxBoard.undoMove(this.lastMove);
            else eatenPiece = this.blackAuxBoard.undoMove(this.lastMove);
            this.board.addPiece(eatenPiece, this.lastMove.pieceEatenTile);
            if (this.lastMove.pieceEaten.getType() == "white")
              this.setState(gameState.Player2PickingPiece);
            else {
              this.setState(gameState.Player1PickingPiece);
            }

            this.lastMove = undefined;
          }
        }

        break;
      case gameState.Player2PickingPiece:
        if (
          this.lastMove != undefined &&
          this.lastMove.piece.animation != undefined
        ) {
          this.lastMove.piece.animation.update(deltaTime);
          if (this.lastMove.piece.animation.isOver()) {
            this.board.undoMove(this.lastMove);
            this.lastMove.piece.animation = undefined;

            //Animation of the piece that was eaten

            if (this.lastMove.pieceEaten == undefined) {
              this.setState(gameState.Player1PickingPiece);
              this.lastMove = undefined;
            } else if (this.lastMove.pieceEaten != undefined) {
              if (this.lastMove.pieceEaten.getType() == "white") {
                this.lastMove.pieceEaten.animation = new MyCircularAnimation(
                  this.scene,
                  this.whiteAuxBoard.getLastAddedTile().getDisplayCoords(),
                  this.lastMove.pieceEatenTile.getDisplayCoords(),
                  1000,
                  false
                );
              } else {
                this.lastMove.pieceEaten.animation = new MyCircularAnimation(
                  this.scene,
                  this.blackAuxBoard.getLastAddedTile().getDisplayCoords(),
                  this.lastMove.pieceEatenTile.getDisplayCoords(),
                  1000,
                  false
                );
              }
            }
          }
        } else if (
          this.lastMove != undefined &&
          this.lastMove.pieceEaten != undefined &&
          this.lastMove.pieceEaten.animation != undefined
        ) {
          this.lastMove.pieceEaten.animation.update(deltaTime);
          if (this.lastMove.pieceEaten.animation.isOver()) {
            this.lastMove.pieceEaten.animation = undefined;
            if (this.lastMove.pieceEaten.getType() == "white")
              eatenPiece = this.whiteAuxBoard.undoMove(this.lastMove);
            else eatenPiece = this.blackAuxBoard.undoMove(this.lastMove);
            this.board.addPiece(eatenPiece, this.lastMove.pieceEatenTile);
            if (this.lastMove.pieceEaten.getType() == "white")
              this.setState(gameState.Player2PickingPiece);
            else {
              this.setState(gameState.Player1PickingPiece);
            }
            this.lastMove = undefined;
          }
        }
        break;
      case gameState.Player1MovingPiece:
        this.availablePieces = undefined;
        this.availableDestinations = undefined;

        this.selectedPiece.animation.update(deltaTime);
        pos = this.selectedPiece.animation.getCurrentPos();

        if (this.pieceEaten != undefined)
          collision = this.detectCollision(
            pos,
            this.pieceEaten.getTile().getDisplayCoords()
          );

        if (collision) {
          this.selectedPiece.animation.stop();
          if (this.pieceEaten.animation == undefined) {
            this.pieceEaten.animation = new MyCircularAnimation(
              this.scene,
              this.pieceEaten.getTile().getDisplayCoords(),
              this.blackAuxBoard.getNextEmptyTile().getDisplayCoords(),
              2000,
              true
            );
          }

          this.pieceEaten.animation.update(deltaTime);
          if (this.pieceEaten.animation.isOver()) {
            this.pieceEaten.animation = undefined;
            this.board.removePiece(this.pieceEaten.getTile());
            this.blackAuxBoard.addPiece(this.pieceEaten);
            this.selectedPiece.animation.start();
          }
        }

        if (this.selectedPiece.animation.isOver()) {
          this.selectedPiece.animation = undefined;
          console.log(this.pieceEaten);
          if (
            this.board.movePiece(
              this.selectedPiece,
              this.board.getTile(this.selectedPiece),
              this.selectedDestination
            )
          ) {
            this.move.turnKing();
          }

          this.gameSequence.addMove(this.move);
          this.move = undefined;
          console.log(this.pieceEaten);
          if (this.pieceEaten != undefined) {
            this.selectedPiece = this.board
              .getTileByCoords(this.selectedDestination.coords)
              .getPiece();
            this.pieceEaten = undefined;
            this.selectedDestination = undefined;

            let availableDestinations = this.board.getAvailableDestinations(
              this.selectedPiece
            );
            console.log(availableDestinations);
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
        }
        break;
      case gameState.Player2MovingPiece:
        this.availablePieces = undefined;
        this.availableDestinations = undefined;

        this.selectedPiece.animation.update(deltaTime);
        pos = this.selectedPiece.animation.getCurrentPos();

        if (this.pieceEaten != undefined)
          collision = this.detectCollision(
            pos,
            this.pieceEaten.getTile().getDisplayCoords()
          );

        if (collision) {
          this.selectedPiece.animation.stop();
          if (this.pieceEaten.animation == undefined) {
            this.pieceEaten.animation = new MyCircularAnimation(
              this.scene,
              this.pieceEaten.getTile().getDisplayCoords(),
              this.whiteAuxBoard.getNextEmptyTile().getDisplayCoords(),
              2000,
              true
            );
          }

          this.pieceEaten.animation.update(deltaTime);
          if (this.pieceEaten.animation.isOver()) {
            this.pieceEaten.animation = undefined;
            this.board.removePiece(this.pieceEaten.getTile());
            this.whiteAuxBoard.addPiece(this.pieceEaten);
            this.selectedPiece.animation.start();
          }
        }

        if (this.selectedPiece.animation.isOver()) {
          this.selectedPiece.animation = undefined;

          //Animate piece
          console.log(this.pieceEaten);
          if (
            this.board.movePiece(
              this.selectedPiece,
              this.board.getTile(this.selectedPiece),
              this.selectedDestination
            )
          ) {
            this.move.turnKing();
          }

          this.gameSequence.addMove(this.move);
          this.move = undefined;
          console.log(this.pieceEaten);
          if (this.pieceEaten != undefined) {
            this.selectedPiece = this.board
              .getTileByCoords(this.selectedDestination.coords)
              .getPiece();
            this.pieceEaten = undefined;
            this.selectedDestination = undefined;

            let availableDestinations = this.board.getAvailableDestinations(
              this.selectedPiece
            );
            console.log(availableDestinations);
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
        }
        break;
    }
  }

  update(deltaTime) {
    this.ongoingStateUpdate(deltaTime);
    this.updateSpot();
  }

  updateSpot() {
    let light = this.scene.lights.find((light) => light.name == "chasing");
    if (light == undefined) {
      return;
    }

    if (this.selectedPiece != undefined) {
      //Search for light with attribute name "chasing"

      if (this.selectedPiece.animation != undefined) {
        light.setPosition(
          this.selectedPiece.animation.getCurrentPos()[0] + 0.5,
          6,
          this.selectedPiece.animation.getCurrentPos()[2] - 0.5,
          1
        );
        light.enable();
      } else {
        light.setPosition(
          this.selectedPiece.getTile().getDisplayCoords()[0] + 0.5,
          6,
          this.selectedPiece.getTile().getDisplayCoords()[2] - 0.5,
          1
        );
        light.enable();
      }
    } else {
      light.disable();
    }

    light.update();
    return;
  }

  /**
   * Undoes the last move
   * Can only be called during the Player1/2PickingPiece states
   */
  undoMove() {
    if (this.lastMove != undefined) return;
    this.lastMove = this.gameSequence.undoMove();
    if (this.lastMove == null) return;

    //Add animation to piece
    this.lastMove.piece.animation = new MySimpleAnimation(
      this.scene,
      this.lastMove.endingTile.getDisplayCoords(),
      this.lastMove.startingTile.getDisplayCoords(),
      1000
    );
  }

  /**
   * Resets the game and the boards
   */
  reset() {
    this.board = new MyBoard(this.scene, this);
    this.whiteAuxBoard = new MyAuxBoard(this.scene, "white");
    this.blackAuxBoard = new MyAuxBoard(this.scene, "black");
    this.animator = new MyAnimator(this, this.gameSequence);

    this.selectedPiece = undefined;
    this.selectedDestination = undefined;
    this.availablePieces = undefined;
    this.availableDestinations = undefined;
    this.pieceEaten = undefined;
  }

  playMovie() {
    this.animator.start();
  }

  /**
   * Displays the game
   */
  display() {
    if (this.scene.graph.components["game"].transformation != undefined)
      this.scene.multMatrix(this.scene.graph.components["game"].transformation);

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
