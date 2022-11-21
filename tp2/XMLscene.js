import { CGFappearance, CGFlight, CGFscene, CGFshader } from "../lib/CGF.js";
import { CGFaxis, CGFcamera } from "../lib/CGF.js";

var DEGREE_TO_RAD = Math.PI / 180;

/**
 * getStringFromUrl(url)
 * Function to load a text file from a URL (used to display shader sources)
 */

function getStringFromUrl(url) {
  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.open("GET", url, false);
  xmlHttpReq.send();
  return xmlHttpReq.responseText;
}

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
export class XMLscene extends CGFscene {
  /**
   * @constructor
   * @param {MyInterface} myinterface
   */
  constructor(myinterface) {
    super();
    this.selectedExampleShader = 0;
    this.scaleFactor = 0;
    this.scaleShader = 0;

    this.interface = myinterface;
  }

  /**
   * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
   * @param {CGFApplication} application
   */
  init(application) {
    super.init(application);

    this.sceneInited = false;

    this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);
    this.setUpdatePeriod(100);
    //This variable allows to change between materials pressing the button m/M
    this.currentMaterial = 0;

    // this variable allows to display the axis (it starts disabled)
    this.displayAxis = false;
  }

  /**
   * Initializes the scene cameras.
   */
  initCameras() {
    this.camera = this.graph.views[this.graph.default_view];
    this.interface.setActiveCamera(this.camera);
  }
  /**
   * Initializes the scene lights with the values read from the XML file.
   */
  initLights() {
    var i = 0;
    // Lights index.
    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
      if (i >= 8) break; // Only eight lights allowed by WebGL.

      if (this.graph.lights.hasOwnProperty(key)) {
        var light = this.graph.lights[key];

        this.lights[i].name = key;
        this.lights[i].setPosition(
          light[2][0],
          light[2][1],
          light[2][2],
          light[2][3]
        );
        this.lights[i].setAmbient(
          light[3][0],
          light[3][1],
          light[3][2],
          light[3][3]
        );
        this.lights[i].setDiffuse(
          light[4][0],
          light[4][1],
          light[4][2],
          light[4][3]
        );
        this.lights[i].setSpecular(
          light[5][0],
          light[5][1],
          light[5][2],
          light[5][3]
        );

        if (light[1] == "spot") {
          this.lights[i].setSpotCutOff(light[6]);
          this.lights[i].setSpotExponent(light[7]);
          this.lights[i].setSpotDirection(
            light[8][0],
            light[8][1],
            light[8][2]
          );
        }

        this.lights[i].setVisible(true);
        if (light[0]) this.lights[i].enable();
        else this.lights[i].disable();

        this.lights[i].update();

        i++;
      }
    }
  }

  onShaderCodeVizChanged(v) {
    if (v) this.shadersDiv.style.display = "block";
    else this.shadersDiv.style.display = "none";
  }

  /**
   * Initializes the scene shaders with the values read from the XML file.
   */
  initShaders() {
    /*
    this.testShaders = [
      new CGFshader(this.gl, "shaders/uScale.vert", "shaders/uScale.frag"),
      new CGFshader(this.gl, "shaders/varying.vert", "shaders/varying.frag"),
      new CGFshader(this.gl, "shaders/texture1.vert", "shaders/texture1.frag"),
      new CGFshader(this.gl, "shaders/texture2.vert", "shaders/texture2.frag"),
      new CGFshader(this.gl, "shaders/texture3.vert", "shaders/texture3.frag"),
      new CGFshader(
        this.gl,
        "shaders/texture3anim.vert",
        "shaders/texture3anim.frag"
      ),
      new CGFshader(this.gl, "shaders/texture1.vert", "shaders/sepia.frag"),
      new CGFshader(
        this.gl,
        "shaders/texture1.vert",
        "shaders/convolution.frag"
      ),
    ];
    */

    this.testShaders = [
      new CGFshader(
        this.gl,
        "shaders/texture3anim.vert",
        "shaders/texture3anim.frag"
      ),
    ];

    this.testShaders[0].setUniformsValues({ uSampler2: 1 });
    this.testShaders[0].setUniformsValues({ timeFactor: 0 });

    // additional texture will have to be bound to texture unit 1 later, when using the shader, with "this.texture2.bind(1);"
  }

  /** Handler called when the graph is finally loaded.
   * As loading is asynchronous, this may be called already after the application has started the run loop
   */
  onGraphLoaded() {
    this.axis = new CGFaxis(this, this.graph.referenceLength);

    this.gl.clearColor(
      this.graph.background[0],
      this.graph.background[1],
      this.graph.background[2],
      this.graph.background[3]
    );

    this.setGlobalAmbientLight(
      this.graph.ambient[0],
      this.graph.ambient[1],
      this.graph.ambient[2],
      this.graph.ambient[3]
    );

    this.initLights();

    this.initCameras();

    this.initShaders();

    this.interface.lightsConfig();

    this.interface.camerasConfig();

    this.sceneInited = true;
  }

  //Handler of m key press
  changeMaterialId() {
    this.currentMaterial++;
  }

  updateAxis() {
    console.log("Axis updated");
  }

  updateLights(id) {
    this.lights[id].update();
    console.log("Lights updated");
  }

  // called periodically (as per setUpdatePeriod() in init())
  update(t) {
    // Dividing the time by 100 "slows down" the variation (i.e. in 100 ms timeFactor increases 1 unit).
    // Doing the modulus (%) by 100 makes the timeFactor loop between 0 and 99
    // ( so the loop period of timeFactor is 100 times 100 ms = 10s ; the actual animation loop depends on how timeFactor is used in the shader )
    this.testShaders[0].setUniformsValues({
      timeFactor: (t / 250) % 100,
    });
  }

  /**
   * Displays the scene.
   */
  display() {
    // ---- BEGIN Background, camera and axis setup

    if (!this.sceneInited) return;
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

    this.setActiveShader(this.testShaders[this.selectedExampleShader]);
    this.graph.textures["barrel"].bind(0);
    this.testShaders[this.selectedExampleShader].setUniformsValues({
      normScale: Math.sin(this.scaleFactor),
    });

    // Draw axis
    if (this.displayAxis) {
      this.axis.display();
    }

    for (let i = 0; i < this.lights.length; i++) {
      this.lights[i].update();
    }

    // Displays the scene (MySceneGraph function).
    const idRoot = this.graph.idRoot;
    const root = this.graph.components[idRoot];
    this.drawComponent(root, null, null);

    this.popMatrix();
    // ---- END Background, camera and axis setup
  }

  /**
   * Draws the component received and recursively (top-down, depth-first)
   * draws its children
   * @param {object} component
   */
  drawComponent(component, previousAppId, previousTex) {
    if (component.transformation != undefined)
      this.multMatrix(component.transformation);

    const currentComponentId =
      this.currentMaterial % component.materials.length;

    const appearenceId =
      component.materials[currentComponentId] !== "inherit"
        ? component.materials[currentComponentId]
        : previousAppId;
    let textureId, length_s, length_t;

    switch (component.texture.id) {
      case "inherit":
        textureId = previousTex.id;
        length_s = previousTex.length_s;
        length_t = previousTex.length_t;
        break;
      case "none":
        textureId = null;
        length_s = 1;
        length_t = 1;
        break;
      default:
        textureId = component.texture.id;
        length_s = component.texture.length_s;
        length_t = component.texture.length_t;

        break;
    }

    let textParent = {
      id: textureId,
      length_s: length_s,
      length_t: length_t,
    };

    for (let i = 0; i < component.children.length; i++) {
      this.pushMatrix();

      this.drawComponent(component.children[i], appearenceId, textParent);

      this.popMatrix();
    }

    let currTexture =
      textureId === null ? null : this.graph.textures[textureId];
    let currentApperence = this.graph.appearences[appearenceId];

    currentApperence.setTexture(currTexture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT
    );
    currentApperence.apply();

    for (let j = 0; j < component.primitives.length; j++) {
      component.primitives[j].updateTexCoords(length_s, length_t);
      component.primitives[j].display();
    }
  }
}
