/// <reference path="../lib/babylon.d.ts"/>
/// <reference path="../lib/mummu.d.ts"/>

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

var BoringInkColors = [
    "black",
    "black",
    "black",
    "black",
    "black",
    "black",
    "red",
    "red",
    "red",
    "blue",
    "green",
]

var BoringYears = [
    "1998",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "",
    "now",
    "today"
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
    public checkMat: BABYLON.StandardMaterial;

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
    public doneDoc: number = 0;
    public currentDoc: BoringDoc;
    public currentNotes: BoringNote[] = [];

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

        this.checkMat = new BABYLON.StandardMaterial("check-mat");
        this.checkMat.diffuseColor = BABYLON.Color3.FromHexString("#000000");
        this.checkMat.specularColor.copyFromFloats(0, 0, 0);

        let desk = BABYLON.MeshBuilder.CreateBox("box", { width: 1.5, height: 0.8, depth: 1 });
        desk.position.y = 0.4;
        desk.material = this.deskMat;
        
        this.scene.onPointerPick = ((evt, pickInfo) => {
            if (pickInfo.hit) {
                if (pickInfo.pickedMesh === this.currentDoc) {
                    let result = this.currentDoc.validate(pickInfo.pickedPoint);
                    if (result >= 0) {
                        if (result === this.currentDoc.result) {
                            console.log("good job");
                            this.doneDoc++;
                            this.newAssignement();
                        }
                        else {
                            console.log("bad job");
                        }
                    }
                }
            }
        })
        this.newAssignement();
	}

    public async newAssignement(): Promise<void> {
        if (this.currentDoc) {
            await this.currentDoc.animatePos(new BABYLON.Vector3(0.4 + 0.01 * Math.random(), 0.81 + this.doneDoc * 0.005, 0.2 + 0.01 * Math.random()), 1);
        }
        for (let i = 0; i < this.currentNotes.length; i++) {
            this.currentNotes[i].dispose();
        }
        
        this.currentDoc = new BoringDoc(this);
        this.currentDoc.instantiate();
        this.currentDoc.position.x = -1;
        this.currentDoc.position.y = 1;
        this.currentDoc.animatePos(new BABYLON.Vector3(0, 0.81, 0), 1);
        
        let note = new BoringNote(this);
        note.instantiate("AA", this.randomBoringColor(), BoringWords[this.aaIndexes[0]], BoringWords[this.aaIndexes[1]], BoringWords[this.aaIndexes[2]]);
        note.animatePos(new BABYLON.Vector3(
            -0.22 + Math.random() * 0.06,
            0.81,
            0.22 + Math.random() * 0.06
        ), 1);
        
        let noteA = new BoringNote(this);
        noteA.instantiate("A", this.randomBoringColor(), BoringWords[this.aIndexes[0]], BoringWords[this.aIndexes[1]]);
        noteA.animatePos(new BABYLON.Vector3(
            -0.07 + Math.random() * 0.06,
            0.81,
            0.22 + Math.random() * 0.06
        ), 1);
        
        let noteF = new BoringNote(this);
        noteF.instantiate("F", this.randomBoringColor(), BoringWords[this.fIndex]);
        noteF.animatePos(new BABYLON.Vector3(
            0.17 + Math.random() * 0.06,
            0.81,
            0.22 + Math.random() * 0.06
        ), 1);

        this.currentNotes = [note, noteA, noteF];
    }

    public generateIndexes(): void {
        this.aaIndexes = [];
        let ok = false;
        while (!ok) {
            let r1 = Math.floor(Math.random() * BoringWords.length);
            let r2 = Math.floor(Math.random() * BoringWords.length);
            let r3 = Math.floor(Math.random() * BoringWords.length);
            if (r1 != r2 && r2 != r3 && r1 != r3) {
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
    
    public randomBoringInkColor(): string {
        return BoringInkColors[Math.floor(Math.random() * BoringInkColors.length)];
    }
    
    public randomBoringYear(): string {
        return BoringYears[Math.floor(Math.random() * BoringYears.length)];
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