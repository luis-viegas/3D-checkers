class MyArcAnimation{
    constructor(scene, from, to , duration){
        this.scene = scene;
        this.from = from;
        this.to = to;
        this.duration = duration;
        this.time = 0;

        this.translateStart = [0, 0, 0]
        this.translateEnd = [to[0] - from[0], to[1] - from[1], to[2] - from[2]]

        //Calculate middle point of from and to
        this.center = [(from[0] + to[0])/2, (from[1] + to[1])/2, (from[2] + to[2])/2]

        //Calculate radius
        this.radius = Math.sqrt(Math.pow(this.center[0] - from[0], 2) + Math.pow(this.center[1] - from[1], 2) + Math.pow(this.center[2] - from[2], 2))

        //Calculate X rotation angle

        this.translation = [0, 0, 0]

        this.animationMatrix = mat4.create();
    }

    update(deltaTime){
        this.time += deltaTime;
        if(this.time >= this.duration){
            mat4.translate(this.animationMatrix, this.animationMatrix, this.translateEnd);
            return
        }
        let ratio = this.time / this.duration;
        this.transl


    /**
     * Calculates the angle between the x axis and the vector from the center to the from point
     * @returns {float} the angle
     */
    calculateXRotation(){
        let vector = [this.from[0] - this.center[0], this.from[1] - this.center[1], this.from[2] - this.center[2]]
        let angle = Math.acos(vector[0]/this.radius)
        return angle
    }
}