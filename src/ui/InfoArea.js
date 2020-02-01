import { InfoArea } from "./consts";

let money;
let selectedObjectTitle;
let selectedPopulation;
let selectedGrowthRate;
let selectedIncomeRate;
let selectedSpreadRate;

export function setupInfoArea(scene) {
  var rect = new Phaser.Geom.Rectangle(
    InfoArea.x,
    InfoArea.y,
    InfoArea.width,
    InfoArea.height
  );
  var graphics = scene.add.graphics({ fillStyle: { color: 0xa0a0a0 } });
  graphics.fillRectShape(rect);

  money = scene.add.text(
    InfoArea.x + InfoArea.margin,
    InfoArea.y + InfoArea.margin,
    "Hello World",
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
}

export function updateInfoArea(selectedObject, gameState) {
  money.setText("Money: " + gameState.player.money);

  if (selectedObject) {
    console.log("pop: ", selectedObject.model.population);
    selectedObjectTitle.setText("Planet #" + selectedObject.model.position);

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
  } else {
    selectedObjectTitle.setText("");
    selectedPopulation.setText("");
    selectedGrowthRate.setText("");
    selectedIncomeRate.setText("");
    selectedSpreadRate.setText("");
  }
}
