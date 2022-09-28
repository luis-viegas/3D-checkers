import { CGFobject } from '../lib/CGF.js';
/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
export class MyTriangle extends CGFobject {
	constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
        this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;

        /**
         * Distance between vertices
         * a = p1 to p2
         * b = p2 to p3
         * c = p3 to p1
         */

        this.a = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)+Math.pow(z2-z1,2))
        this.b = Math.sqrt(Math.pow(x3-x2,2)+Math.pow(y3-y2,2)+Math.pow(z3-z2,2))
        this.c = Math.sqrt(Math.pow(x1-x3,2)+Math.pow(y1-y3,2)+Math.pow(z1-z3,2))

        this.cosAC = (Math.pow(this.a,2) - Math.pow(this.b,2) + Math.pow(this.c,2))/(2* this.a*this.c)
        this.sinAC = Math.sqrt(1-Math.pow(this.cosAC,2))

        this.cosAB = (Math.pow(this.a,2) + Math.pow(this.b,2) - Math.pow(this.c,2))/(2* this.a*this.b)
        this.sinAB = Math.sqrt(1-Math.pow(this.cosAB,2))

        this.cosBC = (-Math.pow(this.a,2) + Math.pow(this.b,2) + Math.pow(this.c,2))/(2* this.b*this.c)
        this.sinBC = Math.sqrt(1-Math.pow(this.cosBC,2))

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

        //Normals of Triangle
        const surfaceNormal = this.calculateSurfaceNormal();

		this.normals = [
			surfaceNormal.x, surfaceNormal.y, surfaceNormal.z,
			surfaceNormal.x, surfaceNormal.y, surfaceNormal.z,
			surfaceNormal.x, surfaceNormal.y, surfaceNormal.z
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */
        //TODO Textures for triangles
		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

    /**
     * Calculate vector U and vector V
     * Vector U is p2-p1 and vector V is p3-p1
     * Normal N is U x V so:
     * Nx = U.y * V.z - U.z* V.y
     * Ny = U.z * V.x - U.x* V.z
     * Nz = U.x * V.y - U.y* V.x
     */
    calculateSurfaceNormal(){
        const U = {
            'x' : this.x2 - this.x1,
            'y' : this.y2 - this.y1,
            'z' : this.z2 - this.z1 
        }

        const V = {
            'x' : this.x3 - this.x1,
            'y' : this.y3 - this.y1,
            'z' : this.z3 - this.z1 
        }

        const N = {
            'x' : U.y * V.z - U.z* V.y,
            'y' : U.z * V.x - U.x* V.z,
            'z' : U.x * V.y - U.y* V.x
        }

        return N;
    }

    calculateUVTextureMapping(){
        
    }
}