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
    public doneDocs: BoringDoc[] = [];
    public currentDoc: BoringDoc;
    public currentNotes: BoringNote[] = [];

    public async createScene(): Promise<void> {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = BABYLON.Color4.FromHexString("#272b2e");
        this.light = new BABYLON.HemisphericLight("light", (new BABYLON.Vector3(2, 3, -1)).normalize(), this.scene);

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

        let motivation1 = BABYLON.MeshBuilder.CreatePlane("mot1", { width: 0.270, height: 0.380 });
        let motivation1Material = new BABYLON.StandardMaterial("mot1-mat");
        motivation1Material.diffuseTexture = new BABYLON.Texture("./datas/motivation-270-380.png");
        motivation1Material.specularColor.copyFromFloats(0, 0, 0);
        motivation1.material = motivation1Material;
        motivation1.position.z = 3.95;
        motivation1.position.y = 1.4;
        motivation1.scaling.copyFromFloats(3, 3, 3);

        let motivation2 = BABYLON.MeshBuilder.CreatePlane("motivation2", { width: 0.270, height: 0.380 });
        let motivation2Material = new BABYLON.StandardMaterial("motivation2-mat");
        motivation2Material.diffuseTexture = new BABYLON.Texture("./datas/motivation-280-392.png");
        motivation2Material.specularColor.copyFromFloats(0, 0, 0);
        motivation2.material = motivation2Material;
        motivation2.position.z = 3.95;
        motivation2.position.y = 1.4;
        motivation2.position.x = - 2;
        motivation2.scaling.copyFromFloats(3, 3, 3);

        let motivation3 = BABYLON.MeshBuilder.CreatePlane("motivation3", { width: 0.338, height: 0.450 });
        let motivation3Material = new BABYLON.StandardMaterial("motivation3-mat");
        motivation3Material.diffuseTexture = new BABYLON.Texture("./datas/motivation-338-450.png");
        motivation3Material.specularColor.copyFromFloats(0, 0, 0);
        motivation3.material = motivation3Material;
        motivation3.position.z = 3.95;
        motivation3.position.y = 1.4;
        motivation3.position.x = 2;
        motivation3.scaling.copyFromFloats(3, 3, 3);

        let room = BABYLON.SceneLoader.ImportMesh("", "./datas/room.babylon");
        
        this.scene.onPointerPick = ((evt, pickInfo) => {
            if (pickInfo.hit) {
                if (pickInfo.pickedMesh === this.currentDoc) {
                    let result = this.currentDoc.validate(pickInfo.pickedPoint);
                    if (result >= 0) {
                        if (result === this.currentDoc.result) {
                            console.log("good job");
                            this.newAssignement();
                        }
                        else {
                            setTimeout(() => {
                                this.gameover();
                            }, 1000)
                        }
                    }
                }
            }
        })

        
        document.getElementById("play").onclick = () => {
            this.play();
        }
	}

    public timer: number = 0;
    public play(): void {
        this.timer = 0;
        this.doneDocs.forEach(doneDoc => {
            doneDoc.dispose();
        })
        this.doneDocs = [];
        if (this.currentDoc) {
            this.currentDoc.dispose();
            this.currentDoc = undefined;
        }
        this.newAssignement();
        document.getElementById("gameover-screen").style.display = "none";
        document.getElementById("play").style.display = "none";
    }

    public gameover(): void {
        let h = Math.floor(this.timer / 3600);
        let t = this.timer - h * 3600;
        let m = Math.floor(t / 60);
        let s = t - m * 60;

        document.getElementById("hours").innerText = h.toFixed(0) + " hours, " + m.toFixed(0) + " minutes, " + s.toFixed(0) + " seconds."
        document.getElementById("count").innerText = this.doneDocs.length.toFixed(0);
        document.getElementById("salary").innerText = (0.00323611111 * this.timer).toFixed(2) + " €";
        document.getElementById("gameover-screen").style.display = "block";
        document.getElementById("play").style.display = "";
    }

    public async newAssignement(): Promise<void> {
        if (this.currentDoc) {
            await this.currentDoc.animatePos(new BABYLON.Vector3(0.4 + 0.01 * Math.random(), 0.82 + this.doneDocs.length * 0.005, 0.2 + 0.01 * Math.random()), 1);
            this.doneDocs.push(this.currentDoc);
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
            0.815,
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
            let dt = this.scene.deltaTime;
            if (isFinite(dt)) {
                this.timer += dt / 1000;
            }
            this.camera.rotation.x = Math.max(Math.min(this.camera.rotation.x, Math.PI / 3), - Math.PI / 8);
            this.camera.rotation.y = Math.max(Math.min(this.camera.rotation.y, Math.PI / 3.5), - Math.PI / 3.5);
            this.camera.position.copyFrom(new BABYLON.Vector3(0, 1.3, - 0.4));
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