import Phaser from "phaser";
import { PlanetObject } from "../ui/PlanetObject";
import { ConnectionObject } from "../ui/ConnectionObject";
import { Player } from "../model/Player";
import { GameState } from "../model/GameState";
import { Universe } from "../model/Universe";
import { GameLogic } from "../model/GameLogic";

const InfoArea = { x: 1200, y: 0, width: 400, height: 900, margin: 20 };

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.level = 0;

    this.planetObjects = this.planets = Array();

    this.infoAreaObjects = {};
  }

  preload() {
    this.load.image("planet", "src/assets/planet.png");
    this.load.image("galaxy", "src/assets/galaxy.jpg");
  }

  create() {
    this.setupUI();

    let universe = new Universe();
    universe.generate(this.level);
    let player = new Player();
    this.gameState = new GameState(universe, player);

    this.planetObjects = this.gameState.universe.planets.map(p =>
      this.createPlanetObject(p)
    );
    // this.connectionObjects = this.gameState.universe.connections.map(c =>
    //   this.createConnectionObject(c)
    // );
  }

  setupUI() {
    let background = this.add.sprite(800, 450, "galaxy");
    background.on("pointerup", () => {
      this.selectedObject = null;
      this.updateInfoArea();
    });
    background.setInteractive();

    var rect = new Phaser.Geom.Rectangle(
      InfoArea.x,
      InfoArea.y,
      InfoArea.width,
      InfoArea.height
    );
    var graphics = this.add.graphics({ fillStyle: { color: 0xa0a0a0 } });
    graphics.fillRectShape(rect);

    this.setupInfoArea();
  }

  setupInfoArea() {
    this.infoAreaObjects.money = this.add.text(
      InfoArea.x + InfoArea.margin,
      InfoArea.y + InfoArea.margin,
      "Hello World",
      {
        fontFamily: '"Roboto Condensed"',
        fontSize: 40
      }
    );

    this.infoAreaObjects.selectedObject = this.add.text(
      InfoArea.x + InfoArea.margin,
      InfoArea.y + InfoArea.height / 2 + InfoArea.margin,
      "",
      {
        fontFamily: '"Roboto Condensed"',
        fontSize: 40
      }
    );

    this.infoAreaObjects.selectedPower = this.add.text(
      InfoArea.x + InfoArea.margin,
      InfoArea.y + InfoArea.height / 2 + 100 + InfoArea.margin,
      "",
      {
        fontFamily: '"Roboto Condensed"',
        fontSize: 24
      }
    );
  }

  onPlanetClicked(planetObject) {
    this.selectedObject = planetObject;
    this.updateInfoArea();
  }

  updateInfoArea() {
    this.infoAreaObjects.money.setText("Money: " + this.gameState.player.money);

    if (this.selectedObject) {
      console.log("pop: ", this.selectedObject.model.population);
      this.infoAreaObjects.selectedObject.setText(
        "Planet #" + this.selectedObject.model.position
      );

      let owner =
        this.selectedObject.model.population.default > 0
          ? "default"
          : this.selectedObject.model.population.player > 0
          ? "player"
          : this.selectedObject.model.population.virus > 0
          ? "virus"
          : null;
      let population = owner
        ? this.selectedObject.model.population[owner]
        : "0";
      this.infoAreaObjects.selectedPower.setText("Population: " + population);
    } else {
      this.infoAreaObjects.selectedObject.setText("");
      this.infoAreaObjects.selectedPower.setText("");
    }
  }

  update() {
    GameLogic.update(this.gameState);
  }

  createPlanetObject(model) {
    let sprite = this.add.sprite(0, 0, "planet");
    let planet = new PlanetObject(model, sprite);
    sprite.on("pointerup", () => this.onPlanetClicked(planet));
    return planet;
  }

  createConnectionObject(model) {
    let connection = new ConnectionObject(model);
    return connection;
  }
}
