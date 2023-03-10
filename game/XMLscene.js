import { CGFappearance, CGFlight, CGFscene, CGFshader } from "../lib/CGF.js";
import { CGFaxis, CGFcamera } from "../lib/CGF.js";
import { MyGame, gameState } from "./myGame.js";
import { MyCameraAnimation } from "./MyCameraAnimation.js";
import { InfiniteAnimation } from "./InfiniteAnimation.js";

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
    this.currentScene = "SciFi-Scene";

    this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);
    this.setUpdatePeriod(1000);
    //This variable allows to change between materials pressing the button m/M
    this.currentMaterial = 0;
    this.setPickEnabled(true);

    // this variable allows to display the axis (it starts disabled)
    this.displayAxis = false;

    this.toggleHighlight = new Object();
  }

  /**
   * Initializes the scene cameras.
   */
  initCameras() {
    //This is used to create a deep copy of the camera

    let starterCameraConfigs = this.graph.views[this.graph.default_view];
    this.camera = new CGFcamera(
      starterCameraConfigs.fov,
      starterCameraConfigs.near,
      starterCameraConfigs.far,
      starterCameraConfigs.position,
      starterCameraConfigs.target
    );

    //this.interface.setActiveCamera(this.camera);
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

        this.lights[i].setConstantAttenuation(light[6][0]);
        this.lights[i].setLinearAttenuation(light[6][1]);
        this.lights[i].setQuadraticAttenuation(light[6][2]);

        if (light[1] == "spot") {
          this.lights[i].setSpotCutOff(light[7]);
          this.lights[i].setSpotExponent(light[8]);

          let location = light[2];
          let target = light[9];
          // Substract the target from the location to get the direction
          let direction = [
            target[0] - location[0],
            target[1] - location[1],
            target[2] - location[2],
          ];
          //Normalize the direction vector
          let magnitude = Math.sqrt(
            direction[0] * direction[0] +
              direction[1] * direction[1] +
              direction[2] * direction[2]
          );
          direction = [
            direction[0] / magnitude,
            direction[1] / magnitude,
            direction[2] / magnitude,
          ];
          this.lights[i].setSpotDirection(
            direction[0],
            direction[1],
            direction[2]
          );
        }

        this.lights[i].setVisible(false);
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
      new CGFshader(this.gl, "shaders/texture1.vert", "shaders/texture1.frag"),
      new CGFshader(
        this.gl,
        "shaders/texture3anim.vert",
        "shaders/texture3anim.frag"
      ),
    ];

    this.testShaders[1].setUniformsValues({ uSampler2: 1 });
    this.testShaders[1].setUniformsValues({
      timeFactor: 0,
      red: 1.0,
      green: 1.0,
      blue: 1.0,
    });

    // additional texture will have to be bound to texture unit 1 later, when using the shader, with "this.texture2.bind(1);"
  }

  addAnimations() {
    //Add rotating animation to the component with name "saturn"
    let saturn = this.graph.components["saturn"];
    saturn.animation = new InfiniteAnimation(this, null, 5000);

    //Add pulsing animation to the component with name "tesseract"
    let tesseract = this.graph.components["tesseract"];
    tesseract.animation = new InfiniteAnimation(this, [0, 0.5, 0], 5000);
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

    //this.interface.lightsConfig();

    this.interface.camerasConfig();

    //this.interface.highlightConfig();

    this.addAnimations();

    this.game = new MyGame(this);

    this.sceneInited = true;

    this.setUpdatePeriod(10);

    this.startTime = null;
  }

  //Handler of s key press
  startGame() {
    if (this.game.state == gameState.NotStarted) {
      this.game.setState(gameState.Player2PickingPiece);
      alert("Game started!");
    }
  }

  //Handler of r key press
  resetGame() {
    this.game = new MyGame(this);
    this.game.setState(gameState.NotStarted);
    alert("Game restarted!");
  }

  undoMove() {
    if (
      this.game.state == gameState.Player1PickingPiece ||
      this.game.state == gameState.Player2PickingPiece
    ) {
      this.game.undoMove();
    }
  }

  updateAxis() {
    console.log("Axis updated");
  }

  updateLights(id) {
    this.lights[id].update();
    console.log("Lights updated");
  }

  updateCamera(cameraId) {
    console.log(cameraId);
    //Animate the camera to the new position
    if (this.cameraAnimation != null) {
      return;
    }
    let nextCamera = this.graph.views[cameraId];
    this.setPickEnabled(false);
    this.cameraAnimation = new MyCameraAnimation(
      this,
      this.camera,
      nextCamera.position,
      nextCamera.target
    );
  }

  update(time) {
    if (this.startTime == null) {
      this.startTime = time;
      this.lastTime = time;
    }

    //Update animations on each component of the scene
    for (let key in this.graph.components) {
      if (this.graph.components[key].animation != null) {
        this.graph.components[key].animation.update(time - this.lastTime);
      }
    }

    if (this.testShaders != undefined) {
      this.testShaders[1].setUniformsValues({
        timeFactor: (time / 100) % 100,
      });
    }

    /**
     * Update the camera animation
     */

    if (this.cameraAnimation != null) {
      this.cameraAnimation.update(time - this.lastTime);

      if (this.cameraAnimation.isOver()) {
        this.cameraAnimation = null;
        this.setPickEnabled(true);
      }
    }

    /**
     * Update the game
     */
    if (this.game != undefined) {
      this.game.update(time - this.lastTime);
    }

    this.lastTime = time;
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

    this.game.managePick(this.pickMode, this.pickResults);
    this.clearPickRegistration();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

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
    const scenes = root.children;
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].name == this.currentScene) {
        this.drawComponent(scenes[i], null, null);
      }
    }
    //this.drawComponent(root, null, null);

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

    if (component.animation != null) {
      this.multMatrix(component.animation.apply());
    }
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

      if (component.children[i].name == "game") {
        this.game.display();
      } else {
        this.drawComponent(component.children[i], appearenceId, textParent);
      }
      this.popMatrix();
    }

    let currTexture =
      textureId === null ? null : this.graph.textures[textureId];
    let currentApperence = this.graph.appearences[appearenceId];

    currentApperence.setTexture(currTexture);

    if (currTexture != null) {
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
    }

    if (component.highlighted != undefined) {
      if (component.isHighlighted == true) {
        this.setActiveShader(this.testShaders[1]);
        this.testShaders[1].setUniformsValues({
          red: component.highlighted.r,
          green: component.highlighted.g,
          blue: component.highlighted.b,
          normScale: component.highlighted.scale_h,
        });
      }
    }

    if (
      this.game != undefined &&
      (this.game.state == gameState.Player1PickingPiece ||
        this.game.state == gameState.Player2PickingPiece)
    ) {
      if (component.name == "undo") {
        this.registerForPick(1000, component);
      }
    }

    if (component.name == "cameraWhite") {
      this.registerForPick(1001, component);
    }

    if (component.name == "cameraBlack") {
      this.registerForPick(1002, component);
    }

    if (component.name == "cameraMiddle") {
      this.registerForPick(1003, component);
    }
    currentApperence.apply();

    for (let j = 0; j < component.primitives.length; j++) {
      component.primitives[j].updateTexCoords(length_s, length_t);
      component.primitives[j].display();
    }
  }
}
