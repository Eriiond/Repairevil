import Phaser from "phaser";
import PlanetObject from "../ui/PlanetObject";
// import Planet from "../model/Planet";
// import { Player } from "../model/Player";
// import { GameState } from "../model/GameState";

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
    // let universe = Universe.generate(this.seed);
    // let player = new Player();
    // this.gameState = new GameState(universe, player);

    // this.planetObjects = this.gameState.universe.planets.map(p =>
    //   this.createPlanetObject(p)
    // );
    // this.connectionObjects = this.gameState.universe.connections.map(c =>
    //   this.createConnectionObject(c)
    // );

    this.setupUI();
  }

  setupUI() {
    //  A simple background for our game
    this.add.image(800, 450, "galaxy");
  }

  update() {
    // GameLogic.update(gameState);
  }

  createPlanetObject(model) {
    let planet = new PlanetObject(model, planetSprite);
    return planet;
  }

  createConnectionObject(model) {
    let connection = new ConnectionObject(model, connectionSprite);
    return connection;
  }
}
