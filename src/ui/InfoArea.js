import { InfoArea } from "./consts";
import { GamePhaseChooseBase, GamePhaseIngame } from "../model/GameState";
import { OwnerPlayer } from "../model/Planet";

// ui elements
let backgroundRect;
let level;
let money;
let selectedObjectTitle;
let selectedPopulation;
let selectedGrowthRate;
let selectedIncomeRate;
let selectedSpreadRate;
let selectedUpdateGrowth;
let selectedUpdateIncome;
let selectedUpdateSpread;

let callbacks;
let eventEmitter;
let chooseBaseButton;

export function setupInfoArea(scene, callbacks, graphics) {
  eventEmitter = scene.eventEmitter;

  backgroundRect = new Phaser.Geom.Rectangle(
    InfoArea.x,
    InfoArea.y,
    InfoArea.width,
    InfoArea.height
  );
  graphics.fillRectShape(backgroundRect);

  level = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 32
    }
  );

  money = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + 60 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 40
    }
  );

  selectedObjectTitle = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 40
    }
  );

  selectedPopulation = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + 100 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 24
    }
  );

  selectedGrowthRate = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + 150 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 24
    }
  );

  selectedIncomeRate = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + 200 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 24
    }
  );

  selectedSpreadRate = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + 250 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 24
    }
  );

  selectedUpdateGrowth = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + 300 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 18
    }
  );
  selectedUpdateGrowth.setInteractive();
  selectedUpdateGrowth.on("pointerup", () => callbacks.onUpgradeGrowth());

  selectedUpdateIncome = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + 340 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 18
    }
  );
  selectedUpdateIncome.setInteractive();
  selectedUpdateIncome.on("pointerup", () => callbacks.onUpgradeIncome());

  selectedUpdateSpread = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + 380 + InfoArea.margin,
    "",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 18
    }
  );
  selectedUpdateSpread.setInteractive();
  selectedUpdateSpread.on("pointerup", () => callbacks.onUpgradeSpread());

  chooseBaseButton = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.height / 2 + 380 + InfoArea.margin,
    "Choose as home planet",
    {
      fontFamily: '"Roboto Condensed"',
      fontSize: 32
    }
  );
  chooseBaseButton.setInteractive();
  chooseBaseButton.on("pointerup", () =>
    eventEmitter.emit("choosePlanetClicked")
  );
}

export function updateInfoArea(selectedObject, gameState) {
  level.setText("Level " + gameState.level);
  money.setText("$" + gameState.player.money);

  if (selectedObject) {
    selectedObjectTitle.setText(selectedObject.model.name);

    selectedPopulation.setText(
      "Population: " + selectedObject.model.getPopulation()
    );
    selectedGrowthRate.setText(
      "Growth Rate: " + selectedObject.model.growthRate
    );
    selectedIncomeRate.setText("Income Rate: " + selectedObject.model.income);
    selectedSpreadRate.setText(
      "Spread Rate: " + selectedObject.model.spreadRate
    );
    selectedUpdateGrowth.setText(
      "Update Growth - $" + selectedObject.model.getGrowthPrice()
    );
    selectedUpdateIncome.setText(
      "Update Income - $" + selectedObject.model.getIncomePrice()
    );
    selectedUpdateSpread.setText(
      "Update Spread  - $" + selectedObject.model.getSpreadPrice()
    );
  } else {
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
    default:
      throw new Error("unknown level state");
  }
}

function resetSelectedArea() {
  selectedObjectTitle.setText("");
  selectedPopulation.setText("");
  selectedGrowthRate.setText("");
  selectedIncomeRate.setText("");
  selectedSpreadRate.setText("");
  selectedUpdateGrowth.setText("");
  selectedUpdateIncome.setText("");
  selectedUpdateSpread.setText("");
}
