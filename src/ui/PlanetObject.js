import { colors } from "../ui/consts";
import { OwnerDefault, OwnerPlayer, OwnerVirus } from "../model/Planet";
import { shortenNumberText } from "./util";

export class PlanetObject {
    constructor(model, sprite) {
        this.model = model;

        this.sprite = sprite;
        this.sprite.setInteractive();
        this.sprite.on("pointerup", this.onClick);
        this.sprite.setOrigin(0.5, 0.5);

        let [x, y] = this.model.getPosition();
        this.sprite.x = x;
        this.sprite.y = y;

        // this.model.getPopulation()
        // this.sprite.scale = scaleFactor;
    }

    init(scene, scale) {
        const [x, y] = this.model.getPosition();
        this.populationText = scene.add.text(x, y + 20, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
        });

        this.populationText.setDepth(0.2);
        this.populationText.setOrigin(0.5, 0.5);

        let graphics = scene.add.graphics({
            lineStyle: {
                width: 1,
                color: 0xffffff,
                alpha: 1,
            },
        });
        let radius = Math.max(scale * 65, 35);
        this.circle = graphics.strokeCircle(x, y, radius);
        this.sprite.scale = scale;
    }

    onClick() {}

    update() {}

    draw(selected) {
        this.populationText &&
            this.populationText.setText(
                "" + shortenNumberText(this.model.getPopulation())
            );

        let owner = this.model.getOwner();
        switch (owner) {
            case OwnerDefault: {
                this.sprite.tint = colors.noTint;
                break;
            }
            case OwnerPlayer: {
                this.sprite.tint = colors.playerPlanetTint;
                break;
            }
            case OwnerVirus: {
                this.sprite.tint = colors.virusPlanetTint;
                break;
            }
            default:
                throw new Error("unknown owner constant: ", owner);
        }

        this.circle.visible = selected;
    }

    destroy() {
        this.sprite.destroy();
        this.populationText.destroy();
        this.circle.destroy();
    }
}
