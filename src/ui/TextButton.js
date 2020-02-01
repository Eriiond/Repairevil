import { colors } from "./consts";

export class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, style);

        this.setInteractive({ useHandCursor: true })
            .on("pointerover", () => this.enterButtonHoverState())
            .on("pointerout", () => this.enterButtonRestState())
            .on("pointerdown", () => this.enterButtonActiveState())
            .on("pointerup", () => {
                this.enterButtonHoverState();
                callback();
            });
    }

    enterButtonHoverState() {
        this.setStyle({ fill: colors.TextButton.hover });
    }

    enterButtonRestState() {
        this.setStyle({ fill: colors.TextButton.default });
    }

    enterButtonActiveState() {
        this.setStyle({ fill: colors.TextButton.active });
    }
}
