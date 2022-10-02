import { CGFXMLreader } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";
import { MyRectangle } from "./MyRectangle.js";
import { MyTriangle } from "./MyTriangle.js";
import { MySphere } from "./MySphere.js";
import { MyTorus } from "./MyTorus.js";

var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
export class MySceneGraph {
  /**
   * @constructor
   */
  constructor(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph.
    this.scene = scene;
    scene.graph = this;

    this.nodes = [];

    this.idRoot = null; // The id of the root element.

    this.axisCoords = [];
    this.axisCoords["x"] = [1, 0, 0];
    this.axisCoords["y"] = [0, 1, 0];
    this.axisCoords["z"] = [0, 0, 1];

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */
    this.reader.open("scenes/" + filename, this);
  }

  /*
   * Callback to be executed after successful reading
   */
  onXMLReady() {
    this.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseXMLFile(rootElement);

    if (error != null) {
      this.onXMLError(error);
      return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
  }

  /**
   * Parses the XML file, processing each block.
   * @param {XML root element} rootElement
   */
  parseXMLFile(rootElement) {
    if (rootElement.nodeName != "sxs") return "root tag <sxs> missing";

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
      nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <scene>
    var index;
    if ((index = nodeNames.indexOf("scene")) == -1)
      return "tag <scene> missing";
    else {
      if (index != SCENE_INDEX)
        this.onXMLMinorError("tag <scene> out of order " + index);

      //Parse scene block
      if ((error = this.parseScene(nodes[index])) != null) return error;
    }

    // <views>
    if ((index = nodeNames.indexOf("views")) == -1)
      return "tag <views> missing";
    else {
      if (index != VIEWS_INDEX)
        this.onXMLMinorError("tag <views> out of order");

      //Parse views block
      if ((error = this.parseView(nodes[index])) != null) return error;
    }

    // <ambient>
    if ((index = nodeNames.indexOf("ambient")) == -1)
      return "tag <ambient> missing";
    else {
      if (index != AMBIENT_INDEX)
        this.onXMLMinorError("tag <ambient> out of order");

      //Parse ambient block
      if ((error = this.parseAmbient(nodes[index])) != null) return error;
    }

    // <lights>
    if ((index = nodeNames.indexOf("lights")) == -1)
      return "tag <lights> missing";
    else {
      if (index != LIGHTS_INDEX)
        this.onXMLMinorError("tag <lights> out of order");

      //Parse lights block
      if ((error = this.parseLights(nodes[index])) != null) return error;
    }
    // <textures>
    if ((index = nodeNames.indexOf("textures")) == -1)
      return "tag <textures> missing";
    else {
      if (index != TEXTURES_INDEX)
        this.onXMLMinorError("tag <textures> out of order");

      //Parse textures block
      if ((error = this.parseTextures(nodes[index])) != null) return error;
    }

    // <materials>
    if ((index = nodeNames.indexOf("materials")) == -1)
      return "tag <materials> missing";
    else {
      if (index != MATERIALS_INDEX)
        this.onXMLMinorError("tag <materials> out of order");

      //Parse materials block
      if ((error = this.parseMaterials(nodes[index])) != null) return error;
    }

    // <transformations>
    if ((index = nodeNames.indexOf("transformations")) == -1)
      return "tag <transformations> missing";
    else {
      if (index != TRANSFORMATIONS_INDEX)
        this.onXMLMinorError("tag <transformations> out of order");

      //Parse transformations block
      if ((error = this.parseTransformations(nodes[index])) != null)
        return error;
    }

    // <primitives>
    if ((index = nodeNames.indexOf("primitives")) == -1)
      return "tag <primitives> missing";
    else {
      if (index != PRIMITIVES_INDEX)
        this.onXMLMinorError("tag <primitives> out of order");

      //Parse primitives block
      if ((error = this.parsePrimitives(nodes[index])) != null) return error;
    }

    // <components>
    if ((index = nodeNames.indexOf("components")) == -1)
      return "tag <components> missing";
    else {
      if (index != COMPONENTS_INDEX)
        this.onXMLMinorError("tag <components> out of order");

      //Parse components block
      if ((error = this.parseComponents(nodes[index])) != null) return error;
    }
    this.log("all parsed");
  }

  /**
   * Parses the <scene> block.
   * @param {scene block element} sceneNode
   */
  parseScene(sceneNode) {
    // Get root of the scene.
    var root = this.reader.getString(sceneNode, "root");
    if (root == null) return "no root defined for scene";

    this.idRoot = root;

    // Get axis length
    var axis_length = this.reader.getFloat(sceneNode, "axis_length");
    if (axis_length == null)
      this.onXMLMinorError(
        "no axis_length defined for scene; assuming 'length = 1'"
      );

    this.referenceLength = axis_length || 1;

    this.log("Parsed scene");

    return null;
  }

  /**
   * Parses the <views> block.
   * @param {view block element} viewsNode
   */
  parseView(viewsNode) {
    this.onXMLMinorError("To do: Parse views and create cameras.");

    return null;
  }

  /**
   * Parses the <ambient> node.
   * @param {ambient block element} ambientsNode
   */
  parseAmbient(ambientsNode) {
    var children = ambientsNode.children;

    this.ambient = [];
    this.background = [];

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
      nodeNames.push(children[i].nodeName);

    var ambientIndex = nodeNames.indexOf("ambient");
    var backgroundIndex = nodeNames.indexOf("background");

    var color = this.parseColor(children[ambientIndex], "ambient");
    if (!Array.isArray(color)) return color;
    else this.ambient = color;

    color = this.parseColor(children[backgroundIndex], "background");
    if (!Array.isArray(color)) return color;
    else this.background = color;

    this.log("Parsed ambient");

    return null;
  }

  /**
   * Parses the <light> node.
   * @param {lights block element} lightsNode
   */
  parseLights(lightsNode) {
    var children = lightsNode.children;

    this.lights = [];
    var numLights = 0;

    var grandChildren = [];
    var nodeNames = [];

    // Any number of lights.
    for (var i = 0; i < children.length; i++) {
      // Storing light information
      var global = [];
      var attributeNames = [];
      var attributeTypes = [];

      //Check type of light
      if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      } else {
        attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
        attributeTypes.push(...["position", "color", "color", "color"]);
      }

      // Get id of the current light.
      var lightId = this.reader.getString(children[i], "id");
      if (lightId == null) return "no ID defined for light";

      // Checks for repeated IDs.
      if (this.lights[lightId] != null)
        return (
          "ID must be unique for each light (conflict: ID = " + lightId + ")"
        );

      // Light enable/disable
      var enableLight = true;
      var aux = this.reader.getBoolean(children[i], "enabled");
      if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
        this.onXMLMinorError(
          "unable to parse value component of the 'enable light' field for ID = " +
            lightId +
            "; assuming 'value = 1'"
        );

      enableLight = aux || 1;

      //Add enabled boolean and type name to light info
      global.push(enableLight);
      global.push(children[i].nodeName);

      grandChildren = children[i].children;
      // Specifications for the current light.

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      for (var j = 0; j < attributeNames.length; j++) {
        var attributeIndex = nodeNames.indexOf(attributeNames[j]);

        if (attributeIndex != -1) {
          if (attributeTypes[j] == "position")
            var aux = this.parseCoordinates4D(
              grandChildren[attributeIndex],
              "light position for ID" + lightId
            );
          else
            var aux = this.parseColor(
              grandChildren[attributeIndex],
              attributeNames[j] + " illumination for ID" + lightId
            );

          if (!Array.isArray(aux)) return aux;

          global.push(aux);
        } else
          return (
            "light " + attributeNames[i] + " undefined for ID = " + lightId
          );
      }

      // Gets the additional attributes of the spot light
      if (children[i].nodeName == "spot") {
        var angle = this.reader.getFloat(children[i], "angle");
        if (!(angle != null && !isNaN(angle)))
          return "unable to parse angle of the light for ID = " + lightId;

        var exponent = this.reader.getFloat(children[i], "exponent");
        if (!(exponent != null && !isNaN(exponent)))
          return "unable to parse exponent of the light for ID = " + lightId;

        var targetIndex = nodeNames.indexOf("target");

        // Retrieves the light target.
        var targetLight = [];
        if (targetIndex != -1) {
          var aux = this.parseCoordinates3D(
            grandChildren[targetIndex],
            "target light for ID " + lightId
          );
          if (!Array.isArray(aux)) return aux;

          targetLight = aux;
        } else return "light target undefined for ID = " + lightId;

        global.push(...[angle, exponent, targetLight]);
      }

      this.lights[lightId] = global;
      numLights++;
    }

    if (numLights == 0) return "at least one light must be defined";
    else if (numLights > 8)
      this.onXMLMinorError(
        "too many lights defined; WebGL imposes a limit of 8 lights"
      );

    this.log("Parsed lights");
    return null;
  }

  /**
   * Parses the <textures> block.
   * @param {textures block element} texturesNode
   */
  parseTextures(texturesNode) {
    //TODO texture parsing
    //For each texture in textures block, check ID and file URL
    this.onXMLMinorError("To do: Parse textures.");
    return null;
  }

  /**
   * Parses the <materials> node.
   * @param {materials block element} materialsNode
   */
  parseMaterials(materialsNode) {
    var children = materialsNode.children;
    const materialProperties = ["emission", "diffuse", "ambient", "specular"]
    this.materials = [];

    var grandChildren = [];
    var nodeNames = [];

    // Any number of materials.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "material") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current material.
      var materialID = this.reader.getString(children[i], "id");
      if (materialID == null) return "no ID defined for material";

      // Checks for repeated IDs.
      if (this.materials[materialID] != null)
        return (
          "ID must be unique for each light (conflict: ID = " + materialID + ")"
        );
      
      //Get material shininess
      let shininess = this.reader.getFloat(children[i], "shininess");
      if(shininess == null) return "Material shininess value: " + shininess + "not valid"
      
      this.materials[materialID]={}
      this.materials[materialID].shininess = shininess;
      grandChildren = children[i].children;

      for(let j= 0; j< grandChildren.length; j++){
        const node = grandChildren[j].nodeName;
        this.log(node)
        if(node in materialProperties)
          return "Parameters for a material must be emission, diffuse, ambient or specular. Not: " + node;
        
        let color = this.parseColor(grandChildren[j], "node with ID: " + node)

        if(typeof color == 'string') return color;

        this.materials[materialID][node] = color;
        
      }
    }

    //this.log("Parsed materials");
    console.log(this.materials)
    return null;
  }

  /**
   * Parses the <transformations> block.
   * @param {transformations block element} transformationsNode
   */
  parseTransformations(transformationsNode) {
    var children = transformationsNode.children;

    this.transformations = [];

    var grandChildren = [];
    

    // Any number of transformations.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "transformation") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current transformation.
      var transformationID = this.reader.getString(children[i], "id");
      if (transformationID == null) return "no ID defined for transformation";

      // Checks for repeated IDs.
      if (this.transformations[transformationID] != null)
        return (
          "ID must be unique for each transformation (conflict: ID = " +
          transformationID +
          ")"
        );

      grandChildren = children[i].children;
      // Specifications for the current transformation.

      var transfMatrix = mat4.create();

      for (var j = 0; j < grandChildren.length; j++) {
        switch (grandChildren[j].nodeName) {
          case "translate":
            var coordinates = this.parseCoordinates3D(
              grandChildren[j],
              "translate transformation for ID " + transformationID
            );
            if (!Array.isArray(coordinates)) return coordinates;

            transfMatrix = mat4.translate(
              transfMatrix,
              transfMatrix,
              coordinates
            );
            break;
          case "scale":
            var coordinates = this.parseCoordinates3D(
              grandChildren[j],
              "scale transformation for ID " + transformationID
            );
            if (!Array.isArray(coordinates)) return coordinates;
            transfMatrix = mat4.scale(
              transfMatrix,
              transfMatrix,
              coordinates
            );
            break;
          case "rotate":
            let axis = this.reader.getString(grandChildren[j], "axis");
            if(axis != "x" && axis!= "y" && axis!="z"){
              return ("Invalid axis received: " + axis );
            }

            let angle = this.reader.getFloat(grandChildren[j], "angle");
            if(angle == null || isNaN(angle) ){
              return ("Invalid angle received: " + angle );
            }
            
            let axisVector = []
            switch (axis){
              case 'x':
                axisVector.push(...[1,0,0])
                break;
              case 'y':
                axisVector.push(...[0,1,0])
                break;
              case 'z':
                axisVector.push(...[0,0,1])
                break;
            }

            let angleRad = (angle * Math.PI) / 180.0;
            console.log(angleRad)
            transfMatrix = mat4.rotate(
              transfMatrix,
              transfMatrix,
              angleRad,
              axisVector
            )
            
            this.log("Parsed rotation of " + angle + " in axis " + axis)
            break;
        }
      }
      this.transformations[transformationID] = transfMatrix;
    }

    this.log("Parsed transformations");
    return null;
  }

  /**
   * Parses the <primitives> block.
   * @param {primitives block element} primitivesNode
   */
  parsePrimitives(primitivesNode) {
    var children = primitivesNode.children;

    this.primitives = [];

    var grandChildren = [];

    // Any number of primitives.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "primitive") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current primitive.
      var primitiveId = this.reader.getString(children[i], "id");
      if (primitiveId == null) return "no ID defined for texture";

      // Checks for repeated IDs.
      if (this.primitives[primitiveId] != null)
        return (
          "ID must be unique for each primitive (conflict: ID = " +
          primitiveId +
          ")"
        );

      grandChildren = children[i].children;

      // Validate the primitive type
      if (
        grandChildren.length != 1 ||
        (grandChildren[0].nodeName != "rectangle" &&
          grandChildren[0].nodeName != "triangle" &&
          grandChildren[0].nodeName != "cylinder" &&
          grandChildren[0].nodeName != "sphere" &&
          grandChildren[0].nodeName != "torus")
      ) {
        return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)";
      }

      // Specifications for the current primitive.
      var primitiveType = grandChildren[0].nodeName;

      // Retrieves the primitive coordinates.
      if (primitiveType == "rectangle") {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], "x1");
        if (!(x1 != null && !isNaN(x1)))
          return (
            "unable to parse x1 of the primitive coordinates for ID = " +
            primitiveId
          );

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], "y1");
        if (!(y1 != null && !isNaN(y1)))
          return (
            "unable to parse y1 of the primitive coordinates for ID = " +
            primitiveId
          );

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], "x2");
        if (!(x2 != null && !isNaN(x2) && x2 > x1))
          return (
            "unable to parse x2 of the primitive coordinates for ID = " +
            primitiveId
          );

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], "y2");
        if (!(y2 != null && !isNaN(y2) && y2 > y1))
          return (
            "unable to parse y2 of the primitive coordinates for ID = " +
            primitiveId
          );

        var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

        this.primitives[primitiveId] = rect;
      } else if (primitiveType == "triangle") {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], "x1");
        if (!(x1 != null && !isNaN(x1)))
          return (
            "unable to parse x1 of the primitive coordinates for ID = " +
            primitiveId
          );

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], "y1");
        if (!(y1 != null && !isNaN(y1)))
          return (
            "unable to parse y1 of the primitive coordinates for ID = " +
            primitiveId
          );

        // z1
        var z1 = this.reader.getFloat(grandChildren[0], "z1");
        if (!(z1 != null && !isNaN(z1)))
          return (
            "unable to parse z1 of the primitive coordinates for ID = " +
            primitiveId
          );

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], "x2");
        if (!(x2 != null && !isNaN(x2)))
          return (
            "unable to parse x2 of the primitive coordinates for ID = " +
            primitiveId
          );

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], "y2");
        if (!(y2 != null && !isNaN(y2)))
          return (
            "unable to parse y2 of the primitive coordinates for ID = " +
            primitiveId
          );

        // z2
        var z2 = this.reader.getFloat(grandChildren[0], "z2");
        if (!(z2 != null && !isNaN(z2)))
          return (
            "unable to parse z2 of the primitive coordinates for ID = " +
            primitiveId
          );

        // x3
        var x3 = this.reader.getFloat(grandChildren[0], "x3");
        if (!(x3 != null && !isNaN(x3)))
          return (
            "unable to parse x1 of the primitive coordinates for ID = " +
            primitiveId
          );

        // y3
        var y3 = this.reader.getFloat(grandChildren[0], "y3");
        if (!(y3 != null && !isNaN(y3)))
          return (
            "unable to parse y3 of the primitive coordinates for ID = " +
            primitiveId
          );

        // z3
        var z3 = this.reader.getFloat(grandChildren[0], "z3");
        if (!(z3 != null && !isNaN(z3)))
          return (
            "unable to parse z3 of the primitive coordinates for ID = " +
            primitiveId
          );

        var triangle = new MyTriangle(
          this.scene,
          primitiveId,
          x1,
          y1,
          z1,
          x2,
          y2,
          z2,
          x3,
          y3,
          z3
        );

        this.primitives[primitiveId] = triangle;
      } else if (primitiveType == "cylinder") {
        //TODO Input validation in cylinder
        let base = this.reader.getFloat(grandChildren[0], "base");
        let top = this.reader.getFloat(grandChildren[0], "top");
        let height = this.reader.getFloat(grandChildren[0], "height");
        let slices = this.reader.getInteger(grandChildren[0], "slices");
        let stacks = this.reader.getInteger(grandChildren[0], "stacks");

        var cylinder = new MyCylinder(
          this.scene,
          primitiveId,
          base,
          top,
          height,
          slices,
          stacks
        );
        this.primitives[primitiveId] = cylinder;
      } else if (primitiveType == "sphere") {
        //TODO Input validation in sphere
        let radius = this.reader.getFloat(grandChildren[0], "radius");
        let slices = this.reader.getInteger(grandChildren[0], "slices");
        let stacks = this.reader.getInteger(grandChildren[0], "stacks");

        var sphere = new MySphere(
          this.scene,
          primitiveId,
          radius,
          slices,
          stacks
        );
        this.primitives[primitiveId] = sphere;
      } else if (primitiveType == "torus") {
        var inner = this.reader.getFloat(grandChildren[0], "inner");
        var outer = this.reader.getFloat(grandChildren[0], "outer");
        var slices = this.reader.getFloat(grandChildren[0], "slices");
        var loops = this.reader.getFloat(grandChildren[0], "loops");
        var torus = new MyTorus(
          this.scene,
          primitiveId,
          inner,
          outer,
          slices,
          loops
        );
        this.primitives[primitiveId] = torus;
      } else {
        console.warn("To do: Parse other primitives.");
      }
    }

    this.log("Parsed primitives");
    return null;
  }

  /**
   * Component Element shall be:
   * components.id ->
   *  - transformation
   *  - materials
   *  - texture
   *  - children
   */

  /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
  parseComponents(componentsNode) {
    var children = componentsNode.children;
    console.log(componentsNode)
    this.components = [];

    var grandChildren = [];
    var grandgrandChildren = [];
    var nodeNames = [];

    // Any number of components.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "component") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current component.
      var componentID = this.reader.getString(children[i], "id");
      if (componentID == null) return "no ID defined for componentID";

      // Checks for repeated IDs.
      if (this.components[componentID] != null)
        return (
          "ID must be unique for each component (conflict: ID = " +
          componentID +
          ")"
        );
      
      this.components[componentID] = {}
      grandChildren = children[i].children;

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      var transformationIndex = nodeNames.indexOf("transformation");
      var materialsIndex = nodeNames.indexOf("materials");
      var textureIndex = nodeNames.indexOf("texture");
      var childrenIndex = nodeNames.indexOf("children");

      // Transformations
      if(transformationIndex == null){
        return ("There should be a 'transformation' camp, even if empty")
      }

      grandgrandChildren = grandChildren[transformationIndex].children;
      //There are no transformations
      if(grandgrandChildren.length == 0){
        this.log("Component " + componentID + " has no transformations");
      }
      else{
        //Verify if it a transformationref and there is no more than 1
        if(grandgrandChildren[0].nodeName == "transformationref" && grandgrandChildren.length >1){
          return "There can only be one reference to a transformation";
        } 

        let transformationMatrix= this.parseComponentTransformation(grandgrandChildren)
        if(typeof transformationMatrix == "string"){ return transformationMatrix}
        this.components[componentID].transformation = transformationMatrix;

      }

      // Materials
      grandgrandChildren = []

      // Texture

      // Children
      grandgrandChildren = []

      if(childrenIndex == null){
        return ("There should be a 'children' camp, and cannot be empty")
      }
      grandgrandChildren = grandChildren[childrenIndex].children;
      let childrenComponents = this.parseComponentsChildren(grandgrandChildren);

      if(typeof childrenComponents == "string"){ return childrenComponents} //Means it is an error message
      this.components[componentID].children = childrenComponents;

    }

  }

  

  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates3D(node, messageError) {
    var position = [];

    // x
    var x = this.reader.getFloat(node, "x");
    if (!(x != null && !isNaN(x)))
      return "unable to parse x-coordinate of the " + messageError;

    // y
    var y = this.reader.getFloat(node, "y");
    if (!(y != null && !isNaN(y)))
      return "unable to parse y-coordinate of the " + messageError;

    // z
    var z = this.reader.getFloat(node, "z");
    if (!(z != null && !isNaN(z)))
      return "unable to parse z-coordinate of the " + messageError;

    position.push(...[x, y, z]);

    return position;
  }

  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates4D(node, messageError) {
    var position = [];

    //Get x, y, z
    position = this.parseCoordinates3D(node, messageError);

    if (!Array.isArray(position)) return position;

    // w
    var w = this.reader.getFloat(node, "w");
    if (!(w != null && !isNaN(w)))
      return "unable to parse w-coordinate of the " + messageError;

    position.push(w);

    return position;
  }

  /**
   * Parse the color components from a node
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseColor(node, messageError) {
    var color = [];

    // R
    var r = this.reader.getFloat(node, "r");
    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
      return "unable to parse R component of the " + messageError;

    // G
    var g = this.reader.getFloat(node, "g");
    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
      return "unable to parse G component of the " + messageError;

    // B
    var b = this.reader.getFloat(node, "b");
    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
      return "unable to parse B component of the " + messageError;

    // A
    var a = this.reader.getFloat(node, "a");
    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
      return "unable to parse A component of the " + messageError;

    color.push(...[r, g, b, a]);

    return color;
  }

  /**
   * Parse the transformations of a component
   * Returns the transformation matrix of a component or null if there is no transformation
   * @param {block element} transformations 
   */
   parseComponentTransformation(transformationsComp){
  
    if(transformationsComp[0].nodeName == "transformationref"){
      //Get transformation id and verify if it exists
      let transformationId = this.reader.getString(transformationsComp[0], "id")
      if(this.transformations[transformationId] == null){ return "Id " + transformationId +" does not reference any transformation"}

      return this.transformations[transformationId];
    }
    else{
      let transfMatrix = mat4.create()
      //There are only normal transformations:
      for (var j = 0; j < transformationsComp.length; j++) {
        switch (transformationsComp[j].nodeName) {
          case "translate":
            var coordinates = this.parseCoordinates3D(
              transformationsComp[j],
              "translate transformation"
            );

            if (!Array.isArray(coordinates)) return coordinates;

            transfMatrix = mat4.translate(
              transfMatrix,
              transfMatrix,
              coordinates
            );
            break;
          case "scale":
            var coordinates = this.parseCoordinates3D(
              transformationsComp[j],
              "scale transformation" 
            );
            if (!Array.isArray(coordinates)) return coordinates;

            transfMatrix = mat4.scale(
              transfMatrix,
              transfMatrix,
              coordinates
            );

            break;
          case "rotate":
            let axis = this.reader.getString(transformationsComp[j], "axis");
            if(axis != "x" && axis!= "y" && axis!="z"){
              return ("Invalid axis received: " + axis );
            }

            let angle = this.reader.getFloat(transformationsComp[j], "angle");
            if(angle == null || isNaN(angle) ){
              return ("Invalid angle received: " + angle );
            }

            
            let axisVector = []
            switch (axis){
              case 'x':
                axisVector.push(...[1,0,0])
                break;
              case 'y':
                axisVector.push(...[0,1,0])
                break;
              case 'z':
                axisVector.push(...[0,0,1])
                break;
            }

            let angleRad = (angle * Math.PI) / 180.0;
            console.log(angleRad)
            transfMatrix = mat4.rotate(
              transfMatrix,
              transfMatrix,
              angleRad,
              axisVector
            )
            
            this.log("Parsed rotation of " + angle + " in axis " + axis)
            break;
        }
      }
      return transfMatrix;
      
    }
  }

  /**
   * Parses the children components of a component
   * Returns the list of components or a string having an message error
   * @param {block of elements} children 
   */
  parseComponentsChildren(children){
    //TODO tweak this to spearate child components and primitives because of materials
    if(children.length == 0){ return "There should be at least one component or a primitive"}
    let componentChildren = [];
    for(let i = 0; i < children.length; i++){
      const child = children[i];

      switch (child.nodeName) {
        case "componentref":
          const componentId = this.reader.getString(child, "id")
          if(this.components[componentId] == null){return "There is no component named " + componentId}
          componentChildren.push(this.components[componentId])
          break;
        
        case "primitiveref": 
          const primitiveId = this.reader.getString(child, "id")
          if(this.primitives[primitiveId] == null){return "There is no component named " + primitiveId}
          componentChildren.push(this.primitives[primitiveId])
          break;

        default:
          return "Invalid block of information: " + child.nodeName + ". Should be 'componentref' of 'primitiveref'"
      }

    }

    return componentChildren;

  }

  /*
   * Callback to be executed on any read error, showing an error on the console.
   * @param {string} message
   */
  onXMLError(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
  }

  /**
   * Callback to be executed on any minor error, showing a warning on the console.
   * @param {string} message
   */
  onXMLMinorError(message) {
    console.warn("Warning: " + message);
  }

  /**
   * Callback to be executed on any message.
   * @param {string} message
   */
  log(message) {
    console.log("   " + message);
  }

  /**
   * Displays the scene, processing each node, starting in the root node.
   */
  displayScene() {
    //TODO: Create display loop for transversing the scene graph

    //To test the parsing/creation of the primitives, call the display function directly
    this.primitives["demoRectangle"].display();
  }
}
