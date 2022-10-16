import {CGFobject} from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   */
  constructor(scene, id,base, top, height, slices, stacks) {
    super(scene);
    this.id = id
    this.base = base;
    this.slices = slices;
    this.height = height;
    this.top = top;
    this.stacks = stacks;


    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the cylinder buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    const radiusStep = (this.top - this.base)/ this.stacks;
    const heightStep = this.height/this.stacks;

    const textHeightStep = 1/this.stacks;
    const textRadiusStep = 1/this.slices;

    let vertex = 0;
    let xCoord = 0.0;
    let tempZ = 0;
    let tempRadius = this.base;
    let angle = 0;
    let angleIncrement = (Math.PI * 2) / this.slices;
    let counter = 0;

    let textXCoord = 0.0;
    let textYCoord = 0.0;

    for(let step = 0; step <this.stacks; step++){

        for (let div = 0; div <= this.slices; div++) {

            this.vertices.push(tempRadius*Math.sin(angle),tempRadius*Math.cos(angle), tempZ);
            this.vertices.push((tempRadius + radiusStep)*Math.sin(angle),(tempRadius+radiusStep)*Math.cos(angle), tempZ + heightStep);

            this.texCoords.push(textXCoord, textYCoord );
            this.texCoords.push(textXCoord, textYCoord + textHeightStep);

            if (div < this.slices) {
                this.indices.push( vertex, vertex + 1, vertex + 2);
                this.indices.push( vertex + 3, vertex + 2, vertex + 1);

                vertex += 2;
            }
            
            //TODO Textures
            //Normais com o método de Smooth Shading de Gouraud
            let normal = [tempRadius*Math.sin(angle) + (tempRadius + radiusStep)*Math.sin(angle),tempRadius*Math.cos(angle) + (tempRadius+radiusStep)*Math.cos(angle) , tempZ +tempZ + heightStep]
            let normalLength = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1] + normal[2]*normal[2]);
            //Normalize the normal
            normal[0] = normal[0]/normalLength;
            normal[1] = normal[1]/normalLength;
            normal[2] = normal[2]/normalLength;

            this.normals.push(normal[0],normal[1],normal[2]);
            this.normals.push(normal[0],normal[1],normal[2]);
            

            angle += angleIncrement;
            textXCoord += textRadiusStep;
        }

        tempZ += heightStep
        tempRadius += radiusStep
        textXCoord = 0.0;
        textYCoord += textHeightStep;
        angle = 0
        vertex+=2;
        
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
