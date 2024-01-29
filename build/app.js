class BoringDoc extends BABYLON.Mesh {
    constructor(game) {
        super("boring-doc");
        this.game = game;
        this.rotation.x = Math.PI / 2;
        this.texture = new BABYLON.DynamicTexture("boring-texture", { width: 420, height: 600 });
        this.texture.update();
        let material = new BABYLON.StandardMaterial("boring-material");
        material.diffuseTexture = this.texture;
        material.specularColor.copyFromFloats(0, 0, 0);
        this.material = material;
    }
    drawAny(y, targetWord) {
        let r = Math.random();
        if (r < 1 / 3) {
            return this.drawBars(y, targetWord);
        }
        else if (r < 2 / 3) {
            return this.drawDiscs(y, targetWord);
        }
        else {
            return this.drawText(y, targetWord);
        }
    }
    drawBars(y, targetWord) {
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        let words = [
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord()
        ];
        if (targetWord) {
            words[Math.floor(4 * Math.random())] = targetWord;
        }
        this.texture.drawText(this.game.randomBoringLabel() + " " + words[0] + " " + this.game.randomBoringYear(), 70, y + 25, "20px Arial", "black", undefined);
        // Bars
        context.strokeStyle = this.game.randomBoringInkColor();
        context.fillStyle = context.strokeStyle;
        for (let i = 0; i < 9; i++) {
            let x = 30 + i * 20;
            let h = 70 * Math.random();
            let h2 = h * Math.random();
            context.strokeRect(x, y + 115 - h, 15, h);
            context.fillRect(x, y + 115 - h2, 15, h2);
        }
        // Bars label
        this.texture.drawText(words[1], 240, y + 55, "25px Arial", this.game.randomBoringInkColor(), undefined);
        this.texture.drawText(words[2], 240, y + 85, "25px Arial", this.game.randomBoringInkColor(), undefined);
        this.texture.drawText(words[3], 240, y + 115, "25px Arial", this.game.randomBoringInkColor(), undefined);
    }
    drawDiscs(y, targetWord) {
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        let words = [
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord()
        ];
        if (targetWord) {
            words[Math.floor(4 * Math.random())] = targetWord;
        }
        this.texture.drawText(this.game.randomBoringLabel() + " " + words[0] + " " + this.game.randomBoringYear(), 70, y + 25, "20px Arial", "black", undefined);
        // Discs
        context.strokeStyle = this.game.randomBoringInkColor();
        context.fillStyle = context.strokeStyle;
        for (let i = 0; i < 3; i++) {
            let x = 60 + i * 50;
            let r = 10 + 15 * Math.random();
            context.beginPath();
            context.arc(x, y + 60, r, 0, 2 * Math.PI);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y + 60);
            context.arc(x, y + 60, r, 0, Math.random() * 2 * Math.PI);
            context.fill();
        }
        // Disc labels
        this.texture.drawText(words[1], 240, y + 55, "25px Arial", this.game.randomBoringInkColor(), undefined);
        this.texture.drawText(words[2], 240, y + 80, "25px Arial", this.game.randomBoringInkColor(), undefined);
        this.texture.drawText(words[3], 120, y + 115, "25px Arial", this.game.randomBoringInkColor(), undefined);
    }
    drawText(y, targetWord) {
        let words = [
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord(),
            this.game.randomWord()
        ];
        if (targetWord) {
            words[Math.floor(10 * Math.random())] = targetWord;
        }
        this.texture.drawText(this.game.randomBoringLabel() + " " + words[0] + " " + this.game.randomBoringYear(), 70, y + 25, "20px Arial", "black", undefined);
        // Conclusion
        this.texture.drawText(words[1] + " " + words[2] + " & " + words[3] + ",", 30, y + 55, "20px Arial", "black", undefined);
        this.texture.drawText(words[4] + ", " + words[5] + " " + words[6] + ".", 30, y + 85, "20px Arial", "black", undefined);
        this.texture.drawText(words[7] + ". " + words[8] + " ? " + words[9] + ".", 30, y + 115, "20px Arial", "black", undefined);
    }
    instantiate() {
        this.game.generateIndexes();
        let data = BABYLON.CreatePlaneVertexData({ width: 0.21, height: 0.297 });
        data.applyToMesh(this);
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        let targetWord;
        this.result = Math.floor(Math.random() * 4);
        if (this.result === 0) {
            let n = Math.floor(Math.random() * 3);
            targetWord = BoringWords[this.game.aaIndexes[n]];
        }
        if (this.result === 1) {
            let n = Math.floor(Math.random() * 2);
            targetWord = BoringWords[this.game.aIndexes[n]];
        }
        if (this.result === 2) {
            targetWord = BoringWords[this.game.fIndex];
        }
        console.log(targetWord);
        let line = Math.floor(Math.random() * 3);
        // Title
        this.texture.drawText(this.game.randomWord() + " " + this.game.randomBoringYear(), 80, 50, "35px Arial", "black", "white");
        this.drawAny(75, line === 0 ? targetWord : undefined);
        this.drawAny(210, line === 1 ? targetWord : undefined);
        this.drawAny(345, line === 2 ? targetWord : undefined);
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.strokeRect(-10, 210, 440, 130);
        // Checkboxes
        context.strokeRect(30, 530, 30, 30);
        this.texture.drawText("AA", 65, 555, "25px Arial", "black", undefined);
        context.strokeRect(120, 530, 30, 30);
        this.texture.drawText("A", 155, 555, "25px Arial", "black", undefined);
        context.strokeRect(210, 530, 30, 30);
        this.texture.drawText("F", 245, 555, "25px Arial", "black", undefined);
        this.texture.drawText("N/A", 300, 505, "20px Arial", "black", undefined);
        context.strokeRect(300, 510, 90, 50);
        this.texture.update();
    }
    validate(point) {
        let check = BABYLON.MeshBuilder.CreateBox("check", { width: 0.01, depth: 0.001, height: 0.01 });
        check.material = this.game.checkMat;
        let local = BABYLON.Vector3.TransformCoordinates(point, this.getWorldMatrix().clone().invert());
        check.position.copyFrom(local);
        check.parent = this;
        let x = (local.x + 0.21 * 0.5) / 0.21 * 420;
        let y = (1 - (local.y + 0.297 * 0.5) / 0.297) * 600;
        if (x > 30 && x < 60) {
            if (y > 530 && y < 560) {
                return 0;
            }
        }
        if (x > 120 && x < 150) {
            if (y > 530 && y < 560) {
                return 1;
            }
        }
        if (x > 210 && x < 240) {
            if (y > 530 && y < 560) {
                return 2;
            }
        }
        if (x > 300 && x < 390) {
            if (y > 510 && y < 560) {
                return 3;
            }
        }
        return -1;
    }
}
class BoringNote extends BABYLON.Mesh {
    constructor(game) {
        super("boring-doc");
        this.game = game;
        this.rotation.x = Math.PI / 2;
        this.texture = new BABYLON.DynamicTexture("boring-texture", { width: 150, height: 150 });
        this.texture.update();
        let material = new BABYLON.StandardMaterial("boring-material");
        material.diffuseTexture = this.texture;
        material.specularColor.copyFromFloats(0, 0, 0);
        this.material = material;
    }
    drawText(y) {
        this.texture.drawText(this.game.randomBoringLabel() + " " + this.game.randomWord(), 70, y + 25, "20px Arial", "black", undefined);
        // Conclusion
        this.texture.drawText(this.game.randomWord() + " " + this.game.randomWord() + " & " + this.game.randomWord() + ",", 30, y + 55, "20px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord() + ", " + this.game.randomWord() + " " + this.game.randomWord() + ".", 30, y + 85, "20px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord() + ". " + this.game.randomWord() + " ? " + this.game.randomWord() + ".", 30, y + 115, "20px Arial", "black", undefined);
    }
    instantiate(title, color, ...words) {
        let data = BABYLON.CreatePlaneVertexData({ width: 0.12, height: 0.12 });
        data.applyToMesh(this);
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        // Title
        this.texture.drawText(title + " :", 40, 30, "25px Arial", "black", color);
        for (let i = 0; i < words.length; i++) {
            this.texture.drawText(words[i], 10, 60 + 35 * i, "22px Arial", "black", undefined);
        }
        this.texture.update();
    }
}
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
];
var BoringLabels = [
    "Report",
    "Conclusion",
    "Appendix",
    "Stats",
    "Intro",
    "Form"
];
var BoringColors = [
    "white",
    "magenta",
    "cyan",
    "yellow"
];
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
];
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
];
class Game {
    constructor(canvasElement) {
        Game.Instance = this;
        this.canvas = document.getElementById(canvasElement);
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock;
        this.engine = new BABYLON.Engine(this.canvas, true);
        BABYLON.Engine.ShadersRepository = "./shaders/";
    }
    getScene() {
        return this.scene;
    }
    async createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = BABYLON.Color4.FromHexString("#272b2e");
        this.light = new BABYLON.HemisphericLight("light", (new BABYLON.Vector3(0, 1, 0)).normalize(), this.scene);
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.3, -0.4));
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
        let doc = new BoringDoc(this);
        doc.instantiate();
        doc.position.y = 0.81;
        this.scene.onPointerPick = ((evt, pickInfo) => {
            if (pickInfo.hit) {
                if (pickInfo.pickedMesh === doc) {
                    let result = doc.validate(pickInfo.pickedPoint);
                    if (result >= 0) {
                        if (result === doc.result) {
                            console.log("good job");
                        }
                        else {
                            console.log("bad job");
                        }
                    }
                }
            }
        });
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
    generateIndexes() {
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
    randomWord() {
        while (true) {
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
    randomBoringLabel() {
        return BoringLabels[Math.floor(Math.random() * BoringLabels.length)];
    }
    randomBoringColor() {
        return BoringColors[Math.floor(Math.random() * BoringColors.length)];
    }
    randomBoringInkColor() {
        return BoringInkColors[Math.floor(Math.random() * BoringInkColors.length)];
    }
    randomBoringYear() {
        return BoringYears[Math.floor(Math.random() * BoringYears.length)];
    }
    animate() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
    async initialize() {
    }
}
window.addEventListener("DOMContentLoaded", () => {
    let main = new Game("render-canvas");
    main.createScene();
    main.initialize().then(() => {
        main.animate();
    });
});
