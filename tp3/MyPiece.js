
class MyPiece {
  constructor(scene, id = -1, type, tile = null, king = false) {
    this.scene = scene;
    this.id = id;
    this.type = type;
    this.tile = tile;
    this.isKing = king
    this.animation = null;
  }

  /**
   * 
   * @returns the type of the piece (white or black)
   */
  getType() {
    return this.type;
  }

  /**
   * 
   * @param {*} type the type of the piece (white or black)
   */
  setType(type) {
    this.type = type;
  }

  setTile(tile) {
    this.tile = tile;
  }

  getTile() {
    return this.tile;
  }


  /**
   * Turns the piece into a king
   */
  turnKing(){
    this.isKing = true;
  }

  
  getAnimation(){
    return this.animation;
  }

  setAnimation(animation){
    this.animation = animation;
  }
  
  

  print() {
    let result = "";
    this.type === "white" ? (result = "W") : (result = "B");
    return result;
  }


  /**
   * 
   * @param {boolean} pickable if the piece is pickable or not 
   * Displays the piece
   */
  display(pickable = false) {
    this.scene.pushMatrix();
    this.scene.translate(this.tile.coords.x, 0, -1 * this.tile.coords.y);
    if(this.animation != null){
      this.scene.multMatrix(this.animation.apply())
    }
    this.scene.multMatrix(this.scene.graph.components["piece"].transformation);





    if (pickable && this.animation == null) {
      this.scene.registerForPick(this.id, this);
      if(this.scene.game.selectedPiece === this)
        this.scene.graph.appearences["pieceSelected"].apply();
      else{
        this.scene.graph.appearences["highlight"].apply();
      }

    }
    else{
      this.scene.registerForPick(-1, this);
      this.scene.graph.appearences[this.type].apply();
    }

 
    for (
      let j = 0;
      j < this.scene.graph.components["piece"].primitives.length;
      j++
    ) {
      this.scene.graph.components["piece"].primitives[j].display();
    }

    if(this.isKing){
      this.scene.pushMatrix();
      this.scene.translate(0,0.4,0);
      this.scene.scale(0.5,0.5,0.5);
      for (
        let j = 0;
        j < this.scene.graph.components["piece"].primitives.length;
        j++
      ) {
        this.scene.graph.components["piece"].primitives[j].display();
      }
      this.scene.popMatrix();

    }


    this.scene.popMatrix();
  }
}

export { MyPiece };
