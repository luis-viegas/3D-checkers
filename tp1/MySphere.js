import {CGFobject} from '../lib/CGF.js';

/**
 * 
 */
export class MySphere extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around Y axis
     */
    constructor(scene, id, radius,  slices, stacks) {
        super(scene);
        this.id = id
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;


        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the sphere buffers
     * TODO: DEFINE TEXTURE COORDINATES
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const lengthInv = 1.0/this.radius;
        const sliceStep = 2* Math.PI / this.slices;
        const stackStep = Math.PI / this.stacks;
        
        for(let stStep = 0; stStep <= this.stacks; stStep++){

            const stackAngle = Math.PI/2 - stStep * stackStep;  //starting from pi/2 to -pi/2 
            const xy = this.radius * Math.cos(stackAngle); //r*cos(u)
            const z = this.radius * Math.sin(stackAngle);  //r*sin(u)

            for(let slStep = 0; slStep<=this.slices; slStep++ ){
                const sliceAngle = slStep * sliceStep;  //starting from 0 to 2pi
                
                const x = xy * Math.cos(sliceAngle)
                const y = xy * Math.sin(sliceAngle)
                this.vertices.push(x,y,z) 
                this.normals.push(x* lengthInv,y* lengthInv, z*lengthInv)

                this.texCoords.push(slStep/this.slices)
                this.texCoords.push(stStep/this.stacks)

            }
        }

        for(let i =0; i < this.stacks; i++){
            let k1 = i*(this.slices+1) //beginning of current stack
            let k2 = k1+ this.slices + 1; //beginning of next stack

            for(let j= 0; j<this.slices; j++, k1++, k2++){

                if(i!=0)
                    this.indices.push(k1, k2, k1+1)
                
                if(i!= (this.stacks-1))
                    this.indices.push(k1+1,k2,k2+1)   
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(nSlices){
        this.nDivs = Math.round(nSlices);

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}