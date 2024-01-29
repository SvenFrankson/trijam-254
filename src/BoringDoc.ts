class BoringDoc extends BABYLON.Mesh {
    
    public texture: BABYLON.DynamicTexture;

    constructor(public game: Game) {
        super("boring-doc");
        this.rotation.x = Math.PI / 2;
        this.texture = new BABYLON.DynamicTexture("boring-texture", { width: 420, height: 600 });
        this.texture.update();
        let material = new BABYLON.StandardMaterial("boring-material");
        material.diffuseTexture = this.texture;
        material.specularColor.copyFromFloats(0, 0, 0);
        this.material = material;
    }

    public drawAny(y: number): void {
        let r = Math.random();
        if (r < 1/3) {
            return this.drawBars(y);
        }
        else if (r < 2/3) {
            return this.drawDiscs(y);
        }
        else {
            return this.drawText(y);
        }
    }

    public drawBars(y: number): void {
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";

        this.texture.drawText(this.game.randomBoringLabel() + " " + this.game.randomWord() + " 2024", 70, y + 25, "20px Arial", "black", undefined);

        // Bars
        for (let i = 0; i < 9; i++) {
            let x = 30 + i * 20;
            let h = 70 * Math.random();
            let h2 = h * Math.random();
            context.strokeRect(x, y + 115 - h, 15, h);
            context.fillRect(x, y + 115 - h2, 15, h2);
        }
        // Bars label
        this.texture.drawText(this.game.randomWord(), 240, y + 55, "25px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord(), 240, y + 85, "25px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord(), 240, y + 115, "25px Arial", "black", undefined);
    }

    public drawDiscs(y: number): void {
        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";

        this.texture.drawText(this.game.randomBoringLabel() +  " " + this.game.randomWord(), 70, y + 25, "20px Arial", "black", undefined);

        // Discs
        for (let i = 0; i < 3; i++) {
            let x = 60 + i * 50;
            let r = 10 + 15 * Math.random();
            context.beginPath();
            context.arc(x, y + 60, r, 0, 2 * Math.PI);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y + 60)
            context.arc(x, y + 60, r, 0, Math.random() * 2 * Math.PI);
            context.fill();
        }

        // Disc labels
        this.texture.drawText(this.game.randomWord(), 240, y + 55, "25px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord(), 240, y + 80, "25px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord(), 120, y + 115, "25px Arial", "black", undefined);
    }

    public drawText(y: number): void {
        this.texture.drawText(this.game.randomBoringLabel() +  " " + this.game.randomWord(), 70, y + 25, "20px Arial", "black", undefined);

        // Conclusion
        this.texture.drawText(this.game.randomWord() + " " + this.game.randomWord() + " & " + this.game.randomWord() + ",", 30, y + 55, "20px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord() + ", " + this.game.randomWord() + " " + this.game.randomWord() + ".", 30, y + 85, "20px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord() + ". " + this.game.randomWord() + " ? " + this.game.randomWord() + ".", 30, y + 115, "20px Arial", "black", undefined);
    }

    public instantiate(): void {
        this.game.generateIndexes();

        let data = BABYLON.CreatePlaneVertexData({ width: 0.21, height: 0.297 });
        data.applyToMesh(this);

        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";

        // Title
        this.texture.drawText(this.game.randomWord() + " 2024", 80, 50, "35px Arial", "black", "white");
        
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