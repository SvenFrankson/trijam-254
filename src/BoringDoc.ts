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

    public drawAny(y: number, targetWord?: string): void {
        let r = Math.random();
        if (r < 1/3) {
            return this.drawBars(y, targetWord);
        }
        else if (r < 2/3) {
            return this.drawDiscs(y, targetWord);
        }
        else {
            return this.drawText(y, targetWord);
        }
    }

    public drawBars(y: number, targetWord?: string): void {
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
        for (let i = 0; i < 9; i++) {
            let x = 30 + i * 20;
            let h = 70 * Math.random();
            let h2 = h * Math.random();
            context.strokeRect(x, y + 115 - h, 15, h);
            context.fillRect(x, y + 115 - h2, 15, h2);
        }
        // Bars label
        this.texture.drawText(words[1], 240, y + 55, "25px Arial", "black", undefined);
        this.texture.drawText(words[2], 240, y + 85, "25px Arial", "black", undefined);
        this.texture.drawText(words[3], 240, y + 115, "25px Arial", "black", undefined);
    }

    public drawDiscs(y: number, targetWord?: string): void {
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

        this.texture.drawText(this.game.randomBoringLabel() +  " " + words[0] + " " + this.game.randomBoringYear(), 70, y + 25, "20px Arial", "black", undefined);

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
        this.texture.drawText(words[1], 240, y + 55, "25px Arial", "black", undefined);
        this.texture.drawText(words[2], 240, y + 80, "25px Arial", "black", undefined);
        this.texture.drawText(words[3], 120, y + 115, "25px Arial", "black", undefined);
    }

    public drawText(y: number, targetWord?: string): void {

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

        this.texture.drawText(this.game.randomBoringLabel() +  " " + words[0] + " " + this.game.randomBoringYear(), 70, y + 25, "20px Arial", "black", undefined);

        // Conclusion
        this.texture.drawText(words[1] + " " + words[2] + " & " + words[3] + ",", 30, y + 55, "20px Arial", "black", undefined);
        this.texture.drawText(words[4] + ", " + words[5] + " " + words[6] + ".", 30, y + 85, "20px Arial", "black", undefined);
        this.texture.drawText(words[7] + ". " + words[8] + " ? " + words[9] + ".", 30, y + 115, "20px Arial", "black", undefined);
    }

    public instantiate(): void {
        this.game.generateIndexes();

        let data = BABYLON.CreatePlaneVertexData({ width: 0.21, height: 0.297 });
        data.applyToMesh(this);

        let context = this.texture.getContext();
        context.lineWidth = 2;
        context.strokeStyle = "black";

        let targetWord: string;
        let result = Math.floor(Math.random() * 4);
        if (result === 0) {
            let n = Math.floor(Math.random() * 3);
            targetWord = BoringWords[this.game.aaIndexes[n]];
        }
        if (result === 1) {
            let n = Math.floor(Math.random() * 2);
            targetWord = BoringWords[this.game.aIndexes[n]];
        }
        if (result === 2) {
            targetWord = BoringWords[this.game.fIndex];
        }
        console.log(targetWord);

        let line = Math.floor(Math.random() * 3)

        // Title
        this.texture.drawText(this.game.randomWord() + " " + this.game.randomBoringYear(), 80, 50, "35px Arial", "black", "white");
        
        this.drawAny(75, line === 0 ? targetWord : undefined);
        this.drawAny(210, line === 1 ? targetWord : undefined);
        this.drawAny(345, line === 2 ? targetWord : undefined);

        // First line
        if (Math.random() > 0.5) {
            context.strokeRect(-10, 75, 440, 130);
        }
        
        // Second line
        if (Math.random() > 0.5) {
            context.strokeRect(-10, 210, 440, 130);
        }
        
        // Third line
        if (Math.random() > 0.5) {
            context.strokeRect(-10, 345, 440, 130);
        }

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
}