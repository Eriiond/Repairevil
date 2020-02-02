import { colors } from "../ui/consts";
import { OwnerDefault, OwnerPlayer, OwnerVirus } from "../model/Planet";
import { shortenNumberText } from "./util";

export class PlanetObject {
    constructor(model, sprite) {
        this.model = model;

        this.sprite = sprite;
        this.sprite.setInteractive();
        this.sprite.on("pointerup", this.onClick);

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

        this.growthRateText = scene.add.text(x - 30, y - 5, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
        });
        this.growthRateText.setDepth(0.2);
        this.growthRateText.setOrigin(0.5, 0.5);
        this.growthRateText.visible = false;

        this.incomeRateText = scene.add.text(x, y - 30, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
        });
        this.incomeRateText.setDepth(0.2);
        this.incomeRateText.setOrigin(0.5, 0.5);
        this.incomeRateText.visible = false;

        this.spreadRateText = scene.add.text(x + 30, y - 5, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
        });
        this.spreadRateText.setDepth(0.2);
        this.spreadRateText.setOrigin(0.5, 0.5);
        this.spreadRateText.visible = false;

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

        this.spreadRateText &&
            this.spreadRateText.setText(
                "" + shortenNumberText(this.model.spreadRate)
            );

        this.growthRateText &&
            this.growthRateText.setText(
                "" + shortenNumberText(this.model.growthRate)
            );

        this.incomeRateText &&
            this.incomeRateText.setText(
                "" + shortenNumberText(this.model.income)
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
        this.circle.destroy();
        this.populationText.destroy();
        this.growthRateText.destory();
        this.incomeRateText.destory();
        this.spreadRateText.destory();
    }

    showFullDetails() {
        this.growthRateText.visible = true;
        this.incomeRateText.visible = true;
        this.spreadRateText.visible = true;
    }

    hideFullDetails() {
        this.growthRateText.visible = false;
        this.incomeRateText.visible = false;
        this.spreadRateText.visible = false;
    }
}
