class MyCameraAnimation {
    constructor(scene, camera, position, target ,  duration = 1500) {
        this.scene = scene;
        this.camera = camera;
        this.finalPosition = position;
        this.finalTarget = target;
        this.duration = duration;
        this.time = 0;
    }

    update(deltaTime) {
        this.time += deltaTime;
        if (this.time >= this.duration) {
            this.time = this.duration;
        }
        
        let t = this.time / this.duration;

        let position = this.camera.position;
        let target = this.camera.target;

        let newPosition = [
            position[0] + (this.finalPosition[0] - position[0]) * t,
            position[1] + (this.finalPosition[1] - position[1]) * t,
            position[2] + (this.finalPosition[2] - position[2]) * t,
        ];

        let newPos = vec4.fromValues(newPosition[0], newPosition[1], newPosition[2], 1);


        let newTarget = [
            target[0] + (this.finalTarget[0] - target[0]) * t,
            target[1] + (this.finalTarget[1] - target[1]) * t,
            target[2] + (this.finalTarget[2] - target[2]) * t,
        ];

        let newTar = vec4.fromValues(newTarget[0], newTarget[1], newTarget[2], 1);
        
        this.camera.setPosition(newPos);
        this.camera.setTarget(newTar);    

    }

    isOver() {
        return this.time >= this.duration;
    }
}


export { MyCameraAnimation };