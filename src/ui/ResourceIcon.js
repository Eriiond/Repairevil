import { shortenNumberText } from "./util";
import { colors } from "./consts";

export class ResourceIcon {
    constructor(sprite, x, y, offsetX, offsetY) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.sprite.setOrigin(0.5, 0.5);
        this.iconSclae = 0.3;
        this.sprite.scale = this.iconSclae;
    }

    init(scene, callback) {
        if (callback) {
            this.sprite
                .setInteractive({ useHandCursor: true })
                .on("pointerover", () => this.enterButtonHoverState())
                .on("pointerout", () => this.enterButtonRestState())
                .on("pointerdown", () => this.enterButtonActiveState())
                .on("pointerup", () => {
                    this.enterButtonHoverState();
                    callback();
                })
                .on("pointerup", callback);
            this.sprite.scale = this.iconSclae * 0.8;
        }
        this.sprite.x = this.x + 100 * this.iconSclae;
        this.sprite.y = this.y + 100 * this.iconSclae;
        this.offsetX && (this.sprite.x = this.sprite.x + this.offsetX);
        this.offsetY && (this.sprite.y = this.sprite.y + this.offsetY);

        this.text = scene.add.text(this.x, this.y + 70, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: callback ? 22 : 28,
        });

        this.hide();
    }

    setValue(value) {
        this.text && this.text.setText("" + shortenNumberText(value));
    }

    setText(value) {
        this.text && this.text.setText(value);
    }

    hide() {
        this.sprite.visible = false;
        this.text.visible = false;
    }

    show() {
        this.sprite.visible = true;
        this.text.visible = true;
    }

    enterButtonHoverState() {
        this.sprite.tint = colors.TextButton.hover;
    }

    enterButtonRestState() {
        this.sprite.tint = colors.TextButton.default;
    }

    enterButtonActiveState() {
        this.sprite.tint = colors.TextButton.active;
    }
}
