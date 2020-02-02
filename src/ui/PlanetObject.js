import { OwnerDefault, OwnerPlayer, OwnerVirus } from "../model/Planet";
import { shortenNumberText } from "./util";

export class PlanetObject {
    constructor(model, planetSprites) {
        this.model = model;

        // this.sprite = sprite;
        // this.sprite.setOrigin(0.5, 0.5);
        // this.sprite.setInteractive();
        // this.sprite.on("pointerup", this.onClick);

        let [x, y] = this.model.getPosition();
        // this.sprite.x = x;
        // this.sprite.y = y;

        this.planetDefault = planetSprites.planetDefault;
        this.planetDefault.setInteractive();
        this.planetPlayer = planetSprites.planetPlayer;
        this.planetPlayer.setInteractive();
        this.planetVirus = planetSprites.planetVirus;
        this.planetVirus.setInteractive();
        this.planetDefault.x = x;
        this.planetDefault.y = y;
        this.planetPlayer.x = x;
        this.planetPlayer.y = y;
        this.planetVirus.x = x;
        this.planetVirus.y = y;

        // this.model.getPopulation()
        // this.sprite.scale = scaleFactor;
    }

    init(scene, scale) {
        this.planetDefault.scale = scale * 0.35;
        this.planetPlayer.scale = scale * 0.35;
        this.planetVirus.scale = scale * 0.35;

        const [x, y] = this.model.getPosition();
        this.populationText = scene.add.text(x, y + 30, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
            stroke: "#000",
            strokeThickness: 4,
        });
        this.populationText.setDepth(0.2);
        this.populationText.setOrigin(0.5, 0.5);

        this.growthRateText = scene.add.text(x - 30, y, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
            stroke: "#000",
            strokeThickness: 4,
        });
        this.growthRateText.setDepth(0.2);
        this.growthRateText.setOrigin(0.5, 0.5);
        this.growthRateText.visible = false;

        this.incomeRateText = scene.add.text(x, y - 30, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
            stroke: "#000",
            strokeThickness: 4,
        });
        this.incomeRateText.setDepth(0.2);
        this.incomeRateText.setOrigin(0.5, 0.5);
        this.incomeRateText.visible = false;

        this.spreadRateText = scene.add.text(x + 30, y, "", {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
            stroke: "#000",
            strokeThickness: 4,
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
        // this.sprite.scale = scale;
        // this.lightSprite.scale = 0.6;
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
                "" + shortenNumberText(this.model.spreadChance)
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
                this.planetDefault.visible = true;
                this.planetPlayer.visible = false;
                this.planetVirus.visible = false;
                break;
            }
            case OwnerPlayer: {
                this.planetDefault.visible = false;
                this.planetPlayer.visible = true;
                this.planetVirus.visible = false;
                break;
            }
            case OwnerVirus: {
                this.planetDefault.visible = false;
                this.planetPlayer.visible = false;
                this.planetVirus.visible = true;
                break;
            }
            default:
                throw new Error("unknown owner constant: ", owner);
        }

        this.circle.visible = selected;
    }

    destroy() {
        this.planetPlayer.destroy();
        this.planetVirus.destroy();
        this.planetDefault.destroy();
        this.populationText.destroy();
        this.circle.destroy();
        this.populationText.destroy();
        this.growthRateText.destroy();
        this.incomeRateText.destroy();
        this.spreadRateText.destroy();
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
