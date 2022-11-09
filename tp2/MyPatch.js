import { CGFnurbsSurface, CGFnurbsObject } from '../lib/CGF.js';

/**
 * MyPatch class which represents a NURBS patch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param degreeU - Number of points in U
 * @param degreeV - Number of points in V
 * @param npartsU - Number of parts in U
 * @param npartsV - Number of parts in V
 * @param controlPoints - Control points
 * 
 */
export class MyPatch{
    constructor(scene, id, degreeU, degreeV, npartsU, npartsV, controlPoints){
        this.scene = scene;
        this.id = id;
        this.degreeU = degreeU;
        this.degreeV = degreeV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;
        console.log(this.controlPoints);

        this.vertexes = [];

        for(let i = 0; i < this.degreeU+1; i++){
            //Create a new array for each U
            let vertex_U = [];
            for(let j = 0; j < this.degreeV+1; j++){
                vertex_U.push(this.controlPoints[i*(this.degreeU+1)+j]);

            }
            this.vertexes.push(vertex_U);
        }

        this.surface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.vertexes);
        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.surface);
    }

    display(){
        this.obj.display();
    }

    updateTexCoords(length_s, length_t) {
        this.obj.updateTexCoordsGLBuffers();
    }

}

