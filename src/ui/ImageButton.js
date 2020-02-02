import { shortenNumberText } from "./util";

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

    init(scene) {
        this.sprite.x = this.x + 100 * this.iconSclae;
        this.sprite.y = this.y + 100 * this.iconSclae;
        this.offsetX && (this.sprite.x = this.x + this.offsetX);
        this.offsetY && (this.sprite.y = this.y + this.offsetY);

        this.text = scene.add.text(this.x, this.y + 70, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 28,
        });

        this.hide();
    }

    setValue(value) {
        this.text && this.text.setText("" + shortenNumberText(value));
    }

    hide() {
        this.sprite.visible = false;
        this.text.visible = false;
    }

    show() {
        this.sprite.visible = true;
        this.text.visible = true;
    }
}
