import { colors } from "./consts";
import { connectionText } from "./util";

export class ConnectionObject {
    constructor(model) {
        this.model = model;

        // this.sprite = this.add.sprite(0, 0, "planet");
        // this.sprite.setInteractive();
        // this.sprite.on("pointerup", this.onClick);
    }

    init(scene) {
        const [startX, startY] = this.model.startPlanet.getPosition();
        const [endX, endY] = this.model.endPlanet.getPosition();
        const x = (startX + endX) / 2;
        const y = (startY + endY) / 2;
        this.spreadText = scene.add.text(x, y, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
            color: "#ffffff",
        });
        this.spreadText.setOrigin(0.5, 0.5);
    }

    draw(scene) {
        this.spreadText &&
            this.spreadText.setText(
                "" + connectionText(this.model.sendPorbability)
            );

        let [startX, startY] = this.model.startPlanet.getPosition();
        let [endX, endY] = this.model.endPlanet.getPosition();
        // const line = new Phaser.Geom.Line(100, 100, startX, startY, endX, endY);
        // graphics.strokeLineShape(line);
        this.line = scene.add
            .line(0, 0, startX, startY, endX, endY, colors.connectionColor, 0.5)
            .setOrigin(0, 0);
    }

    onClick() {}

    destroy() {
        this.line.destroy();
        this.spreadText.destroy();
    }
}
