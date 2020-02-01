import { colors } from "./consts";
import { connectionText } from "./util";
import { OwnerPlayer, OwnerVirus } from "../model/Planet";

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
        this.strokeAlpha = 0.3;
    }

    draw(scene, owner) {
        let [startX, startY] = this.model.startPlanet.getPosition();
        let [endX, endY] = this.model.endPlanet.getPosition();

        let strokeColor = colors.noTint;
        switch (owner) {
            case OwnerPlayer: {
                strokeColor = colors.playerPlanetTint;
                break;
            }

            case OwnerVirus: {
                strokeColor = colors.virusPlanetTint;
                break;
            }

            default: {
            }
        }

        switch (owner) {
            case OwnerPlayer: {
                if (this.cureLine) {
                    let strokeAlpha = Math.min(
                        1,
                        this.cureLine.strokeAlpha + 0.025
                    );
                    let strokeColor = this.cureLine.strokeColor;
                    let lineWith = this.cureLine.lineWidth;
                    this.cureLine.setStrokeStyle(
                        lineWith,
                        strokeColor,
                        strokeAlpha
                    );
                } else {
                    this.cureLine = scene.add.line(
                        0,
                        0,
                        startX,
                        startY,
                        endX,
                        endY,
                        strokeColor,
                        this.strokeAlpha
                    );
                    this.cureLine.setOrigin(0, 0);
                    this.virusLine && this.virusLine.destroy();
                    this.virusLine = null;
                }
                break;
            }

            case OwnerVirus: {
                if (this.virusLine) {
                    let strokeAlpha = Math.min(
                        1,
                        this.virusLine.strokeAlpha + 0.025
                    );
                    let strokeColor = this.virusLine.strokeColor;
                    let lineWith = this.virusLine.lineWidth;
                    this.virusLine.setStrokeStyle(
                        lineWith,
                        strokeColor,
                        strokeAlpha
                    );
                } else {
                    this.virusLine = scene.add.line(
                        0,
                        0,
                        startX,
                        startY,
                        endX,
                        endY,
                        strokeColor,
                        this.strokeAlpha
                    );
                    this.virusLine.setOrigin(0, 0);
                    this.cureLine && this.cureLine.destroy();
                    this.cureLine = null;
                }
                break;
            }

            default: {
                this.spreadText &&
                    this.spreadText.setText(
                        "" + connectionText(this.model.sendPorbability)
                    );
                this.defaultLine = scene.add
                    .line(0, 0, startX, startY, endX, endY, strokeColor, 0.5)
                    .setOrigin(0, 0);
            }
        }
    }

    onClick() {}

    destroyDefaultLine() {
        this.defaultLine && this.defaultLine.destroy();
        this.spreadText && this.spreadText.setText("");
    }

    destroy() {
        this.defaultLine && this.defaultLine.destroy();
        this.virusLine && this.virusLine.destroy();
        this.cureLine && this.cureLine.destroy();
        this.spreadText && this.spreadText.destroy();
    }
}
