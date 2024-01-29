/// <reference path="../lib/babylon.d.ts"/>

class Game {
    
    public static Instance: Game;

	public canvas: HTMLCanvasElement;
	public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public getScene(): BABYLON.Scene {
        return this.scene;
    }

    public camera: BABYLON.FreeCamera;
    public light: BABYLON.HemisphericLight;

    constructor(canvasElement: string) {
        Game.Instance = this;
        
		this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock;
		this.engine = new BABYLON.Engine(this.canvas, true);
		BABYLON.Engine.ShadersRepository = "./shaders/";
	}

    public async createScene(): Promise<void> {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = BABYLON.Color4.FromHexString("#272b2e");
        this.light = new BABYLON.HemisphericLight("light", (new BABYLON.Vector3(2, 2, - 2)).normalize(), this.scene);

        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -2));
        this.camera.rotation.x = Math.PI / 4;
        this.camera.attachControl();

        let desk = BABYLON.MeshBuilder.CreateBox("box", { size: 1 });
	}

	public animate(): void {
		this.engine.runRenderLoop(() => {
			this.scene.render();
		});

		window.addEventListener("resize", () => {
			this.engine.resize();
		});
	}

    public async initialize(): Promise<void> {
        
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let main: Game = new Game("render-canvas");
    main.createScene();
    main.initialize().then(() => {
        main.animate();
    });
});