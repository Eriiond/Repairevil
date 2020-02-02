export class StrengthMeter {
    constructor(x, y, width, height) {
        this.position = { x, y };
        this.width = width;
        this.height = height;
    }

    update(scene, playerPopulation, virusPopulation, defaultPopulation) {
        let totalPopulation =
            playerPopulation + virusPopulation + defaultPopulation;
        let playerRatio = playerPopulation / totalPopulation;
        let virusRatio = virusPopulation / totalPopulation;
        let defaultRatio = defaultPopulation / totalPopulation;
        this.graphics && this.graphics.clear();
        this.graphics = scene.add.graphics();
        this.graphics.fillStyle(0x00ff00, 1.0);
        this.graphics.fillRect(
            this.position.x,
            this.position.y,
            playerRatio * this.width,
            this.height
        );
        this.graphics.fillStyle(0xdddddd, 1.0);
        this.graphics.fillRect(
            this.position.x + playerRatio * this.width,
            this.position.y,
            defaultRatio * this.width,
            this.height
        );
        this.graphics.fillStyle(0xff0000, 1.0);
        this.graphics.fillRect(
            this.position.x +
                playerRatio * this.width +
                defaultRatio * this.width,
            this.position.y,
            virusRatio * this.width,
            this.height
        );
        this.graphics.lineStyle(4, 0x000000, 1.0);
        this.graphics.strokeRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    destroy() {
        this.playerRect.destroy();
    }
}
