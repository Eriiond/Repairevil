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

// ui elements
let backgroundRect;
let level;
let money;
let income;
let selectedObjectTitle;
let selectedPopulation;
let selectedGrowthRate;
let selectedIncomeRate;
let selectedSpreadChance;
let selectedUpdateGrowth;
let selectedUpdateIncome;
let selectedUpdateSpread;
let slider;
let sliderText;

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

    selectedPopulation = scene.add.text(
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 100 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 24,
        }
    );

    selectedGrowthRate = scene.add.text(
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 150 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 24,
        }
    );

    selectedIncomeRate = scene.add.text(
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 200 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 24,
        }
    );

    selectedSpreadChance = scene.add.text(
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 250 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 24,
        }
    );

    slider = new Slider(
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 300 + InfoArea.margin,
        InfoArea.width - 2 * InfoArea.margin - 100,
        20
    );
    slider.init(scene);
    slider.alpha = 0;

    sliderText = scene.add.text(
        InfoArea.x + 310,
        selectedObjectY + 312,
        "45%",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 32,
        }
    );

    selectedUpdateGrowth = new TextButton(
        scene,
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 340 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
            color: colors.TextButton.default,
        },
        callbacks.onUpgradeGrowth
    );
    scene.add.existing(selectedUpdateGrowth);

    selectedUpdateIncome = new TextButton(
        scene,
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 380 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
            color: colors.TextButton.default,
        },
        callbacks.onUpgradeIncome
    );
    scene.add.existing(selectedUpdateIncome);

    selectedUpdateSpread = new TextButton(
        scene,
        InfoArea.x + InfoArea.margin,
        selectedObjectY + 420 + InfoArea.margin,
        "",
        {
            fontFamily: '"Roboto Condensed"',
            fontSize: 18,
            color: colors.TextButton.default,
        },
        callbacks.onUpgradeSpread
    );
    scene.add.existing(selectedUpdateSpread);

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
}

export function setSliderValue(value) {
    slider.setValue(value);
}

export function updateInfoArea(selectedObject, gameState) {
    slider.update();
    sliderText.setText(parseFloat(slider.getValue() * 100).toFixed(0) + "%");

    level.setText("Level " + gameState.level);
    money.setText("$" + shortenNumberText(gameState.player.money));
    const currentIncome = "" + GameLogic.getCurrentIncome(gameState);
    income.setText("+ " + shortenNumberText(currentIncome) + " $/sec");

    if (selectedObject) {
        selectedObjectTitle.setText(selectedObject.model.name);

        selectedPopulation.setText(
            "Population: " +
                shortenNumberText(selectedObject.model.getPopulation())
        );
        selectedGrowthRate.setText(
            "Growth Rate: " + shortenNumberText(selectedObject.model.growthRate)
        );
        selectedIncomeRate.setText(
            "Income Rate: " + shortenNumberText(selectedObject.model.income)
        );
        selectedSpreadChance.setText(
            "Spread Chance: " +
                shortenNumberText(selectedObject.model.spreadChance)
        );
        selectedUpdateGrowth.setText(
            "Upgrade Growth - $" +
                shortenNumberText(selectedObject.model.getGrowthPrice())
        );
        selectedUpdateIncome.setText(
            "Upgrade Income - $" +
                shortenNumberText(selectedObject.model.getIncomePrice())
        );
        selectedUpdateSpread.setText(
            "Upgrade Spread  - $" +
                shortenNumberText(selectedObject.model.getSpreadPrice())
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
        slider.hide();
        sliderText.visible = false;
        resetSelectedArea();
    }

    switch (gameState.gamePhase) {
        case GamePhaseChooseBase:
            selectedUpdateGrowth.visible = false;
            selectedUpdateIncome.visible = false;
            selectedUpdateSpread.visible = false;
            chooseBaseButton.visible = selectedObject !== null;
            break;
        case GamePhaseIngame:
            selectedUpdateGrowth.visible =
                selectedObject !== null &&
                selectedObject.model.getOwner() === OwnerPlayer;
            selectedUpdateIncome.visible =
                selectedObject !== null &&
                selectedObject.model.getOwner() === OwnerPlayer;
            selectedUpdateSpread.visible =
                selectedObject !== null &&
                selectedObject.model.getOwner() === OwnerPlayer;
            chooseBaseButton.visible = false;
            break;
        case GamePhaseEnd:
            selectedUpdateGrowth.visible = true;
            selectedUpdateIncome.visible = true;
            selectedUpdateSpread.visible = true;
            chooseBaseButton.visible = false;
            break;
        default:
            throw new Error("unknown game phase");
    }
}

function resetSelectedArea() {
    selectedObjectTitle.setText("");
    selectedPopulation.setText("");
    selectedGrowthRate.setText("");
    selectedIncomeRate.setText("");
    selectedSpreadChance.setText("");
    selectedUpdateGrowth.setText("");
    selectedUpdateIncome.setText("");
    selectedUpdateSpread.setText("");
}
