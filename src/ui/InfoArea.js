import { InfoArea } from "./consts";

// ui elements
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

export function setupInfoArea(scene, callbacks) {
  const rect = new Phaser.Geom.Rectangle(
    InfoArea.x,
    InfoArea.y,
    InfoArea.width,
    InfoArea.height
  );
  const graphics = scene.add.graphics({ fillStyle: { color: 0xa0a0a0 } });
  graphics.fillRectShape(rect);

  money = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.margin,
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
}

export function updateInfoArea(selectedObject, gameState) {
  money.setText("$" + gameState.player.money);

  if (selectedObject) {
    selectedObjectTitle.setText(selectedObject.model.name);

    let owner =
      selectedObject.model.population.default > 0
        ? "default"
        : selectedObject.model.population.player > 0
        ? "player"
        : selectedObject.model.population.virus > 0
        ? "virus"
        : null;
    let population = owner ? selectedObject.model.population[owner] : "0";
    selectedPopulation.setText("Population: " + population);
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
