class BoringDoc extends BABYLON.Mesh {
    constructor() {
        super("boring-doc");
        this.rotation.x = Math.PI / 2;
        this.texture = new BABYLON.DynamicTexture("boring-texture", { width: 420, height: 600 });
        this.texture.update();
        let material = new BABYLON.StandardMaterial("boring-material");
        material.diffuseTexture = this.texture;
        material.specularColor.copyFromFloats(0, 0, 0);
        this.material = material;
    }
    drawAny(y) {
        let r = Math.random();
        if (r < 1 / 3) {
            return this.drawBars(y);
        }
        else if (r < 2 / 3) {
            return this.drawDiscs(y);
        }
        else {
            return this.drawText(y);
        }
    }
    drawBars(y) {
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        this.texture.drawText("Report " + randomWord() + " 2024", 70, y + 25, "20px Arial", "black", undefined);
        // Bars
        for (let i = 0; i < 9; i++) {
            let x = 30 + i * 20;
            let h = 70 * Math.random();
            let h2 = h * Math.random();
            context.strokeRect(x, y + 115 - h, 15, h);
            context.fillRect(x, y + 115 - h2, 15, h2);
        }
        // Bars label
        this.texture.drawText(randomWord(), 240, y + 55, "25px Arial", "black", undefined);
        this.texture.drawText(randomWord(), 240, y + 85, "25px Arial", "black", undefined);
        this.texture.drawText(randomWord(), 240, y + 115, "25px Arial", "black", undefined);
    }
    drawDiscs(y) {
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        this.texture.drawText("Appendix " + randomWord(), 70, y + 25, "20px Arial", "black", undefined);
        // Discs
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
        this.texture.drawText(randomWord(), 240, y + 55, "25px Arial", "black", undefined);
        this.texture.drawText(randomWord(), 240, y + 80, "25px Arial", "black", undefined);
        this.texture.drawText(randomWord(), 120, y + 115, "25px Arial", "black", undefined);
    }
    drawText(y) {
        this.texture.drawText("Conclusion " + randomWord(), 70, y + 25, "20px Arial", "black", undefined);
        // Conclusion
        this.texture.drawText(randomWord() + " " + randomWord() + " " + randomWord(), 30, y + 55, "25px Arial", "black", undefined);
        this.texture.drawText(randomWord() + " " + randomWord() + " " + randomWord(), 30, y + 85, "25px Arial", "black", undefined);
        this.texture.drawText(randomWord() + " " + randomWord() + " " + randomWord(), 30, y + 115, "25px Arial", "black", undefined);
    }
    instantiate() {
        let data = BABYLON.CreatePlaneVertexData({ width: 0.21, height: 0.297 });
        data.applyToMesh(this);
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        // Title
        this.texture.drawText(randomWord() + " 2024", 80, 50, "35px Arial", "black", "white");
        // First line
        if (Math.random() > 0.5) {
            context.strokeRect(-10, 75, 440, 130);
        }
        this.drawAny(75);
        // Second line
        if (Math.random() > 0.5) {
            context.strokeRect(-10, 210, 440, 130);
        }
        this.drawAny(210);
        // Third line
        if (Math.random() > 0.5) {
            context.strokeRect(-10, 345, 440, 130);
        }
        this.drawAny(345);
        // Checkboxes
        context.strokeRect(30, 530, 30, 30);
        this.texture.drawText("AA", 65, 555, "25px Arial", "black", undefined);
        context.strokeRect(120, 530, 30, 30);
        this.texture.drawText("A", 155, 555, "25px Arial", "black", undefined);
        context.strokeRect(210, 530, 30, 30);
        this.texture.drawText("F", 245, 555, "25px Arial", "black", undefined);
        this.texture.drawText("VALIDATE", 300, 505, "20px Arial", "black", undefined);
        context.strokeRect(300, 510, 90, 50);
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
];
function randomWord() {
    return BoringWords[Math.floor(Math.random() * BoringWords.length)];
}
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
        let desk = BABYLON.MeshBuilder.CreateBox("box", { width: 1.5, height: 0.8, depth: 1 });
        desk.position.y = 0.4;
        desk.material = this.deskMat;
        let doc = new BoringDoc();
        doc.instantiate();
        doc.position.y = 0.81;
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
