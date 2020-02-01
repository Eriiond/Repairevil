import Phaser from "phaser";
import { PlanetObject } from "../ui/PlanetObject";
import { ConnectionObject } from "../ui/ConnectionObject";
import { Player } from "../model/Player";
import { GameState } from "../model/GameState";
import { Universe } from "../model/Universe";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.level = 0;

    this.planetObjects = this.planets = Array();
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
    //  A simple background for our game
    this.add.image(800, 450, "galaxy");
  }

  update() {
    // GameLogic.update(gameState);
  }

  createPlanetObject(model) {
    let sprite = this.add.sprite(0, 0, "planet");
    let planet = new PlanetObject(model, sprite);
    return planet;
  }

  createConnectionObject(model) {
    let connection = new ConnectionObject(model);
    return connection;
  }
}
