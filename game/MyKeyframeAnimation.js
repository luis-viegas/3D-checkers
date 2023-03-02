import {MyAnimation} from './MyAnimation.js';

export class MyKeyframeAnimation extends MyAnimation{
    /**
     * @constructor
     * @param {MySceneGraph} graph
     * @param {MyKeyframe} keyframe
     */
    constructor(scene, animationId, keyframes) {
        super(scene, animationId);
        this.scene = scene;
        this.animationId = animationId;
        this.keyframes = keyframes;
        this.keyframeIndex = 0;
        this.currentKeyframe = this.keyframes[this.keyframeIndex];
        this.nextKeyframe = this.keyframes[this.keyframeIndex + 1];
        this.time = 0;
        this.finished = false;

        this.animationMatrix = mat4.create();
        
    }

    
    apply(){
        return this.animationMatrix;
    }

    update(time){
        if(this.finished) return;

        console.log(this.time)

        this.time += time;

        if(this.time<this.keyframes[0].instant){
            mat4.scale(this.animationMatrix, this.animationMatrix, [0,0,0]);
            return;
        }
      
        if(this.time >= this.nextKeyframe.instant){
            this.keyframeIndex++;
            this.currentKeyframe = this.nextKeyframe;
            this.nextKeyframe = this.keyframes[this.keyframeIndex + 1];
        }
        if(this.keyframeIndex == this.keyframes.length-1){
            this.finished = true;
            return;
        }

        let ratio = (this.time - this.currentKeyframe.instant) / (this.nextKeyframe.instant - this.currentKeyframe.instant);
        
        let translation = [
            this.currentKeyframe.translation[0] + (this.nextKeyframe.translation[0] - this.currentKeyframe.translation[0]) * ratio,
            this.currentKeyframe.translation[1] + (this.nextKeyframe.translation[1] - this.currentKeyframe.translation[1]) * ratio,
            this.currentKeyframe.translation[2] + (this.nextKeyframe.translation[2] - this.currentKeyframe.translation[2]) * ratio
        ]
        let rotation = [
            this.currentKeyframe.rotation[0] + (this.nextKeyframe.rotation[0] - this.currentKeyframe.rotation[0]) * ratio,
            this.currentKeyframe.rotation[1] + (this.nextKeyframe.rotation[1] - this.currentKeyframe.rotation[1]) * ratio,
            this.currentKeyframe.rotation[2] + (this.nextKeyframe.rotation[2] - this.currentKeyframe.rotation[2]) * ratio
        ]
        let scale = [
            this.currentKeyframe.scale[0] + (this.nextKeyframe.scale[0] - this.currentKeyframe.scale[0]) * ratio,
            this.currentKeyframe.scale[1] + (this.nextKeyframe.scale[1] - this.currentKeyframe.scale[1]) * ratio,
            this.currentKeyframe.scale[2] + (this.nextKeyframe.scale[2] - this.currentKeyframe.scale[2]) * ratio
        ]

        this.animationMatrix = mat4.create();
        mat4.translate(this.animationMatrix, this.animationMatrix, translation);
        mat4.rotate(this.animationMatrix, this.animationMatrix, rotation[0], [1, 0, 0]);
        mat4.rotate(this.animationMatrix, this.animationMatrix, rotation[1], [0, 1, 0]);
        mat4.rotate(this.animationMatrix, this.animationMatrix, rotation[2], [0, 0, 1]);
        mat4.scale(this.animationMatrix, this.animationMatrix, scale);
 
    
    }

}