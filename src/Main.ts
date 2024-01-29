/// <reference path="../lib/babylon.d.ts"/>

var BoringWords = [
    "Trade",
    "Growth",
    "Increase",
    "Revenue",
    "Disruption",
    "Progress",
    "Downsize",
    "Layoff",
    "Effort",
    "Endeavor",
    "Industry",
    "Performance",
    "Production",
    "Struggle",
    "Task",
    "Trial",
    "Yearly",
    "Exchange",
    "Accomplished",
    "Ethic",
    "Business",
    "Money",
    "Project",
    "Function",
    "Operate",
    "Service"
]

var BoringLabels = [
    "Report",
    "Conclusion",
    "Appendix",
    "Stats",
    "Intro",
    "Form"
]

var BoringColors = [
    "white",
    "magenta",
    "cyan",
    "yellow"
]

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

    public deskMat: BABYLON.StandardMaterial;

    public aaIndexes: number[];
    public aIndexes: number[];
    public fIndex: number;

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
        this.light = new BABYLON.HemisphericLight("light", (new BABYLON.Vector3(0, 1, 0)).normalize(), this.scene);

        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.3, - 0.4));
        this.camera.minZ = 0.1;
        this.camera.maxZ = 10;
        this.camera.rotation.x = Math.PI / 4;
        this.camera.attachControl();

        this.deskMat = new BABYLON.StandardMaterial("desk-mat");
        this.deskMat.diffuseColor = BABYLON.Color3.FromHexString("#aeb2bd");
        this.deskMat.specularColor.copyFromFloats(0, 0, 0);

        let desk = BABYLON.MeshBuilder.CreateBox("box", { width: 1.5, height: 0.8, depth: 1 });
        desk.position.y = 0.4;
        desk.material = this.deskMat;
        
        let doc = new BoringDoc(this);
        doc.instantiate();
        doc.position.y = 0.81;
        
        let note = new BoringNote(this);
        note.instantiate("AA", this.randomBoringColor(), BoringWords[this.aaIndexes[0]], BoringWords[this.aaIndexes[1]], BoringWords[this.aaIndexes[2]]);
        note.position.y = 0.81;
        note.position.x = -0.15;
        note.position.z = 0.25;
        
        let noteA = new BoringNote(this);
        noteA.instantiate("A", this.randomBoringColor(), BoringWords[this.aIndexes[0]], BoringWords[this.aIndexes[1]]);
        noteA.position.y = 0.81;
        noteA.position.x = 0;
        noteA.position.z = 0.30;
        
        let noteF = new BoringNote(this);
        noteF.instantiate("F", this.randomBoringColor(), BoringWords[this.fIndex]);
        noteF.position.y = 0.81;
        noteF.position.x = 0.2;
        noteF.position.z = 0.23;
	}

    public generateIndexes(): void {
        this.aaIndexes = [];
        let ok = false;
        while (!ok) {
            let r1 = Math.floor(Math.random() * BoringWords.length);
            let r2 = Math.floor(Math.random() * BoringWords.length);
            let r3 = Math.floor(Math.random() * BoringWords.length);
            if (r1 != r2 && r2 != r3) {
                ok = true;
                this.aaIndexes = [r1, r2, r3];
            }
        }

        this.aIndexes = [];
        ok = false;
        while (!ok) {
            let r1 = Math.floor(Math.random() * BoringWords.length);
            let r2 = Math.floor(Math.random() * BoringWords.length);
            if (r1 != r2) {
                if (this.aaIndexes.indexOf(r1) === -1) {
                    if (this.aaIndexes.indexOf(r2) === -1) {
                        ok = true;
                        this.aIndexes = [r1, r2];
                    }
                }
            }
        }

        ok = false;
        while (!ok) {
            let r1 = Math.floor(Math.random() * BoringWords.length);
            if (this.aaIndexes.indexOf(r1) === -1) {
                if (this.aIndexes.indexOf(r1) === -1) {
                    ok = true;
                    this.fIndex = r1;
                }
            }
        }
    }

    public randomWord(): string {
        while(true) {
            let index = Math.floor(Math.random() * BoringWords.length);
            if (this.aaIndexes.indexOf(index) === -1) {
                if (this.aIndexes.indexOf(index) === -1) {
                    if (index != this.fIndex) {
                        return BoringWords[index];
                    }
                }
            }
        }
    }
    
    public randomBoringLabel(): string {
        return BoringLabels[Math.floor(Math.random() * BoringLabels.length)];
    }
    
    public randomBoringColor(): string {
        return BoringColors[Math.floor(Math.random() * BoringColors.length)];
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