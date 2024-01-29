class BoringNote extends BABYLON.Mesh {
    
    public texture: BABYLON.DynamicTexture;

    constructor(public game: Game) {
        super("boring-doc");
        this.rotation.x = Math.PI / 2;
        this.texture = new BABYLON.DynamicTexture("boring-texture", { width: 150, height: 150 });
        this.texture.update();
        let material = new BABYLON.StandardMaterial("boring-material");
        material.diffuseTexture = this.texture;
        material.specularColor.copyFromFloats(0, 0, 0);
        this.material = material;
    }

    public drawText(y: number): void {
        this.texture.drawText(this.game.randomBoringLabel() +  " " + this.game.randomWord(), 70, y + 25, "20px Arial", "black", undefined);

        // Conclusion
        this.texture.drawText(this.game.randomWord() + " " + this.game.randomWord() + " & " + this.game.randomWord() + ",", 30, y + 55, "20px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord() + ", " + this.game.randomWord() + " " + this.game.randomWord() + ".", 30, y + 85, "20px Arial", "black", undefined);
        this.texture.drawText(this.game.randomWord() + ". " + this.game.randomWord() + " ? " + this.game.randomWord() + ".", 30, y + 115, "20px Arial", "black", undefined);
    }

    public instantiate(title: string, color: string, ...words: string[]): void {

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