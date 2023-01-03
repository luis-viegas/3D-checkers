class MyCircularAnimation {
  constructor(scene, from, to, duration, mainToAux) {
    this.scene = scene;
    this.from = from;
    this.to = to;
    this.duration = duration;
    this.time = 0;
    this.mainToAux = mainToAux;
    this.translateStart = [0, 0, 0];
    this.translateEnd = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];

    //Calculate middle point of from and to
    this.center = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2,
      (from[2] + to[2]) / 2,
    ];
    console.log(from, to);
    //Calculate radius
    this.radius = Math.sqrt(
      Math.pow(this.center[0] - from[0], 2) +
        Math.pow(this.center[1] - from[1], 2) +
        Math.pow(this.center[2] - from[2], 2)
    );
    //Calculate X rotation angle
    this.yRotation = this.mainToAux
      ? this.calculateYRotation()
      : -this.calculateYRotation();

    if (this.mainToAux) {
      this.yRotation =
        this.center[2] > this.to[2] ? -this.yRotation : this.yRotation;
    } else {
      this.yRotation =
        this.center[2] > this.from[2] ? -this.yRotation : this.yRotation;
    }
    this.translation = [0, 0, 0];

    this.animationMatrix = mat4.create();
  }

  apply() {
    return this.animationMatrix;
  }

  update(deltaTime) {
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
    let rotationAngle = Math.PI * ratio;

    //Calculate point on circle with z=center[2] and rotate the circlePoint around the y axis by the calculated angle
    this.circlePoint = [
      this.center[0] +
        this.radius * Math.cos(rotationAngle) * Math.cos(this.yRotation),
      this.center[1] + this.radius * Math.sin(rotationAngle),
      this.center[2] +
        this.radius * Math.cos(rotationAngle) * Math.sin(this.yRotation),
    ];

    //Rotate circlePoint by the calculated angle on vector that passes through the center and parallel to the y axis

    this.translation = [
      this.circlePoint[0] - this.from[0],
      this.circlePoint[1] - this.from[1],
      this.circlePoint[2] - this.from[2],
    ];

    mat4.translate(
      this.animationMatrix,
      this.animationMatrix,
      this.translation
    );
  }

  /**
   * Calculates the angle between the x axis and the vector from the center to the from point
   * @returns {float} the angle
   */
  calculateYRotation() {
    //calculate vector from center to from
    let centerToFrom = [
      this.from[0] - this.center[0],
      this.from[1] - this.center[1],
      this.from[2] - this.center[2],
    ];
    let centerPlusX = [1, 0, 0];

    //Calculate dot product between centerToFrom and centerPlusX
    let dotProduct =
      centerToFrom[0] * centerPlusX[0] +
      centerToFrom[1] * centerPlusX[1] +
      centerToFrom[2] * centerPlusX[2];
    //Calculate magnitude of centerToFrom and centerPlusX
    let magnitude =
      Math.sqrt(
        Math.pow(centerToFrom[0], 2) +
          Math.pow(centerToFrom[1], 2) +
          Math.pow(centerToFrom[2], 2)
      ) *
      Math.sqrt(
        Math.pow(centerPlusX[0], 2) +
          Math.pow(centerPlusX[1], 2) +
          Math.pow(centerPlusX[2], 2)
      );

    //Calculate angle
    let angle = Math.acos(dotProduct / magnitude);
    console.log((angle * 180) / Math.PI);
    return -angle;
  }

  isOver() {
    return this.time >= this.duration;
  }
}

export { MyCircularAnimation };
