//Oscilates if from and to are diff and rotates on y axis if from and to are the same
class InfiniteAnimation {
  constructor(scene, to, duration) {
    this.scene = scene;
    this.to = to;
    this.duration = duration;
    this.time = 0;

    if (to == null) {
      this.rotate = true;
    } else {
      this.rotate = false;
    }

    this.animationMatrix = mat4.create();
  }

  apply() {
    return this.animationMatrix;
  }

  update(deltaTime) {
    this.animationMatrix = mat4.create();
    this.time += deltaTime;

    if (this.rotate) {
      this.rotateAnimation(deltaTime);
    } else {
      this.translateAnimation(deltaTime);
    }
  }

  rotateAnimation() {
    //infinite cicle of rotation
    let ratio = this.time / this.duration;

    if (ratio > 1) {
      this.time = 0;
      ratio = 0;
    }

    mat4.rotateZ(
      this.animationMatrix,
      this.animationMatrix,
      ratio * 2 * Math.PI
    );
  }

  translateAnimation() {
    //infinite cicle of translation from - (to - from) to from +(to - from)
    let ratio = this.time / this.duration;

    if (ratio > 1) {
      this.time = 0;
      ratio = 0;
    }

    let x = this.to[0] * Math.sin(ratio * 2 * Math.PI);
    let y = this.to[1] * Math.sin(ratio * 2 * Math.PI);
    let z = this.to[2] * Math.sin(ratio * 2 * Math.PI);

    mat4.translate(this.animationMatrix, this.animationMatrix, [x, y, z]);
  }
}

export { InfiniteAnimation };
