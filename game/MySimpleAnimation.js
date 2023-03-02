class MySimpleAnimation {
  /**
   * Receives a scene, a starting point, an ending point and a duration and creates a SimpleAnimation object
   * @param {XMLscene} scene
   * @param {Array(3)} from x, y, z
   * @param {Array(3)} to x, y, z
   * @param {integer} duration
   */
  constructor(scene, from, to, duration = 1000) {
    this.scene = scene;
    this.from = from;
    this.to = to;
    this.duration = duration;
    this.time = 0;

    this.translateStart = [0, 0, 0];
    this.translateEnd = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];

    this.translation = [0, 0, 0];

    this.animationMatrix = mat4.create();

    this.active = true;
  }

  /**
   * Returns the animation matrix
   * @returns {mat4} the animation matrix
   */
  apply() {
    return this.animationMatrix;
  }

  /**
   * Stops the animation
   */
  stop() {
    this.active = false;
  }

  /**
   * Starts the animation
   */
  start() {
    this.active = true;
  }

  /**
   * Updates the animation matrix
   * @param {integer} deltaTime
   */
  update(deltaTime) {
    if (!this.active) {
      return;
    }
    this.animationMatrix = mat4.create();
    this.time += deltaTime;
    if (this.time >= this.duration) {
      mat4.translate(
        this.animationMatrix,
        this.animationMatrix,
        this.translateEnd
      );
      return;
    }
    let ratio = this.time / this.duration;
    this.translation = [
      this.translateStart[0] +
        (this.translateEnd[0] - this.translateStart[0]) * ratio,
      this.translateStart[1] +
        (this.translateEnd[1] - this.translateStart[1]) * ratio,
      this.translateStart[2] +
        (this.translateEnd[2] - this.translateStart[2]) * ratio,
    ];
    mat4.translate(
      this.animationMatrix,
      this.animationMatrix,
      this.translation
    );
    return;
  }

  /**
   * Gives the current position of the animation
   */
  getCurrentPos() {
    return [
      this.from[0] + this.translation[0],
      this.from[1] + this.translation[1],
      this.from[2] + this.translation[2],
    ];
  }

  /**
   * Returns true if the animation is over, false otherwise
   * @returns {boolean} true if the animation is over, false otherwise
   */
  isOver() {
    return this.time >= this.duration;
  }
}

export { MySimpleAnimation };
