import { InfoArea, colors } from "./consts";
import {
    GamePhaseChooseBase,
    GamePhaseIngame,
    GamePhaseEnd,
} from "../model/GameState";
import { OwnerPlayer } from "../model/Planet";
import { shortenNumberText } from "./util";
import { GameLogic } from "../model/GameLogic";
import { TextButton } from "./TextButton";
import { Slider } from "./Slider";
import { ResourceIcon } from "./ResourceIcon";

// ui elements
let backgroundRect;
let level;
let money;
let income;
let selectedObjectTitle;
let selectedUpdateGrowth;
let selectedUpdateIncome;
let selectedUpdateSpread;
let slider;
let sliderText;
let populationIcon;
let growthIcon;
let incomeIcon;
let spreadIcon;

let callbacks;
let eventEmitter;
let chooseBaseButton;
let selectedObjectY;

export function setupInfoArea(scene, callbacks, graphics) {
    eventEmitter = scene.eventEmitter;
    selectedObjectY = InfoArea.y + 250;

    let backgroundRectShape = new Phaser.Geom.Rectangle(
        InfoArea.x,
        InfoArea.y,
        InfoArea.width,
        InfoArea.height
    );
    backgroundRect = graphics.fillRectShape(backgroundRectShape);
    // graphics.setInteractive(backgroundRectShape, event => {
    //     console.log(event);
    //     return event.x > 900;
    // });

    level = scene.add.text(
        InfoArea.x + InfoArea.margin,
        InfoArea.y + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 32,
        }
    );

    money = scene.add.text(
        InfoArea.x + InfoArea.margin,
        InfoArea.y + 60 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 40,
        }
    );

    income = scene.add.text(
        InfoArea.x + 150 + InfoArea.margin,
        InfoArea.y + 72 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 20,
        }
    );

    selectedObjectTitle = scene.add.text(
        InfoArea.x + InfoArea.margin,
        selectedObjectY + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 40,
        }
    );

    let populationSprite = scene.add.sprite(0, 0, "icon_population");
    populationIcon = new ResourceIcon(
        populationSprite,
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 100 + InfoArea.margin,
        0,
        10
    );
    populationIcon.init(scene);

    let growthSprite = scene.add.sprite(0, 0, "icon_growth");
    growthIcon = new ResourceIcon(
        growthSprite,
        InfoArea.x + InfoArea.margin + 100,
        selectedObjectY + 100 + InfoArea.margin
    );
    growthIcon.init(scene);

    let upgradeSprite1 = scene.add.sprite(0, 0, "icon_upgrade");
    selectedUpdateGrowth = new ResourceIcon(
        upgradeSprite1,
        InfoArea.x + InfoArea.margin + 100,
        selectedObjectY + 200 + InfoArea.margin,
        0,
        10
    );
    selectedUpdateGrowth.init(scene, callbacks.onUpgradeGrowth);

    let incomeSprite = scene.add.sprite(0, 0, "icon_income");
    incomeIcon = new ResourceIcon(
        incomeSprite,
        InfoArea.x + InfoArea.margin + 200,
        selectedObjectY + 100 + InfoArea.margin
    );
    incomeIcon.init(scene);

    let upgradeSprite2 = scene.add.sprite(0, 0, "icon_upgrade");
    selectedUpdateIncome = new ResourceIcon(
        upgradeSprite2,
        InfoArea.x + InfoArea.margin + 200,
        selectedObjectY + 200 + InfoArea.margin,
        0,
        10
    );
    selectedUpdateIncome.init(scene, callbacks.onUpgradeIncome);

    let spreadSprite = scene.add.sprite(0, 0, "icon_spread");
    spreadIcon = new ResourceIcon(
        spreadSprite,
        InfoArea.x + InfoArea.margin + 300,
        selectedObjectY + 100 + InfoArea.margin
    );
    spreadIcon.init(scene);

    let upgradeSprite3 = scene.add.sprite(0, 0, "icon_upgrade");
    selectedUpdateSpread = new ResourceIcon(
        upgradeSprite3,
        InfoArea.x + InfoArea.margin + 300,
        selectedObjectY + 200 + InfoArea.margin,
        0,
        10
    );
    selectedUpdateSpread.init(scene, callbacks.onUpgradeSpread);

    slider = new Slider(
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 350 + InfoArea.margin,
        InfoArea.width - 2 * InfoArea.margin - 100,
        20
    );
    slider.init(scene);
    slider.alpha = 0;

    sliderText = scene.add.text(
        InfoArea.x + 310,
        selectedObjectY + 362,
        "45%",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 32,
        }
    );

    chooseBaseButton = new TextButton(
        scene,
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 380 + InfoArea.margin,
        "Choose as home planet",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 32,
            color: colors.TextButton.default,
        },
        () => eventEmitter.emit("choosePlanetClicked")
    );
    scene.add.existing(chooseBaseButton);
    chooseBaseButton.visible = false;
}

export function setSliderValue(value) {
    slider.setValue(value);
}

export function updateInfoArea(selectedObject, gameState) {
    slider.update();
    sliderText.setText(parseFloat(slider.getValue() * 100).toFixed(0) + "%");
    if (selectedObject) {
        selectedObjectTitle.setText(selectedObject.model.name);

        // selectedPopulation.setText(
        //     "Population: " +
        //         shortenNumberText(selectedObject.model.getPopulation())
        // );

        populationIcon.setValue(selectedObject.model.getPopulation());
        populationIcon.show();
        growthIcon.setValue(selectedObject.model.growthRate);
        growthIcon.show();
        incomeIcon.setValue(selectedObject.model.income);
        incomeIcon.show();
        spreadIcon.setValue(selectedObject.model.spreadChance);
        spreadIcon.show();
        selectedUpdateGrowth.show();
        selectedUpdateIncome.show();
        selectedUpdateSpread.show();

        selectedUpdateGrowth.setText(
            "$" + shortenNumberText(selectedObject.model.getGrowthPrice())
        );
        selectedUpdateIncome.setText(
            "$" + shortenNumberText(selectedObject.model.getIncomePrice())
        );
        selectedUpdateSpread.setText(
            "$" + shortenNumberText(selectedObject.model.getSpreadPrice())
        );

        if (
            gameState.gamePhase === GamePhaseIngame &&
            selectedObject.model.getOwner() === OwnerPlayer
        ) {
            slider.show();
            sliderText.visible = true;
        } else {
            slider.hide();
            sliderText.visible = false;
        }
    } else {
        populationIcon.hide();
        growthIcon.hide();
        incomeIcon.hide();
        spreadIcon.hide();
        selectedUpdateGrowth.hide();
        selectedUpdateIncome.hide();
        selectedUpdateSpread.hide();

        slider.hide();
        sliderText.visible = false;
        resetSelectedArea();
    }

    if (gameState) {
        level.setText("Level " + gameState.level);
        money.setText("$" + shortenNumberText(gameState.player.money));
        const currentIncome = "" + GameLogic.getCurrentIncome(gameState);
        income.setText("+ " + shortenNumberText(currentIncome) + " $/sec");

        switch (gameState.gamePhase) {
            case GamePhaseChooseBase:
                // selectedUpdateGrowth.hide();
                // selectedUpdateIncome.hide();
                // selectedUpdateSpread.hide();
                chooseBaseButton.visible = selectedObject !== null;
                break;
            case GamePhaseIngame:
                // if (
                //     selectedObject !== null &&
                //     selectedObject.model.getOwner() === OwnerPlayer
                // ) {
                //     selectedUpdateGrowth.show();
                //     selectedUpdateIncome.show();
                //     selectedUpdateSpread.show();
                // } else {
                //     selectedUpdateGrowth.hide();
                //     selectedUpdateIncome.hide();
                //     selectedUpdateSpread.hide();
                // }
                chooseBaseButton.visible = false;
                break;
            case GamePhaseEnd:
                // selectedUpdateGrowth.hide();
                // selectedUpdateIncome.hide();
                // selectedUpdateSpread.hide();
                chooseBaseButton.visible = false;
                break;
            default:
                throw new Error("unknown game phase");
        }
    }
}

function resetSelectedArea() {
    selectedObjectTitle.setText("");
    // selectedPopulation.setText("");
    populationIcon.hide();
    growthIcon.hide();
    incomeIcon.hide();
    spreadIcon.hide();
    selectedUpdateGrowth.hide();
    selectedUpdateIncome.hide();
    selectedUpdateSpread.hide();
}
