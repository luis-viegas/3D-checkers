import { CGFinterface, CGFapplication, dat } from '../lib/CGF.js';

/**
* MyInterface class, creating a GUI interface.
*/

export class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by default)

        this.initKeys();

        this.generalConfig()

        
        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};

    }


    processKeyDown(event) {
        if(event.key == 'm'){
            this.scene.changeMaterialId()
        } 
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    /**
     * Adds a folder containing general configs
     */
    generalConfig(){
        let folder = this.gui.addFolder("General Configs");
        
        folder.add(this.scene, 'displayAxis')
            .name("Display Axis")
                .onChange(this.scene.updateAxis.bind(this.scene));
    }

    /**
     * Adds a folder containing the lights configs
     * 
     */
    lightsConfig(){

        let folder = this.gui.addFolder("Lights Configs");
        for(let i = 0; i < this.scene.lights.length; i++){
            if(  this.scene.lights[i].hasOwnProperty('name')){
            folder.add(this.scene.lights[i], 'enabled')
                .name("Light " + this.scene.lights[i].name)
                    .onChange(this.scene.updateLights.bind(this.scene, i));
            }    

        }
        
    }

}