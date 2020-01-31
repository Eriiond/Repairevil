import Phaser from "phaser";
import PlanetObject from "../ui/PlanetObject";
import Planet from "../model/Planet";

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
    // this.gameState = new GameState(universe);

    //  A simple background for our game
    this.add.image(800, 450, "galaxy");

    // this.planetObjects = this.gameState.universe.planets.map(p =>
    //   this.createPlanetObject(p)
    // );
    // this.connectionObjects = this.gameState.universe.connections.map(c =>
    //   this.createConnectionObject(c)
    // );
  }

  update() {
    // GameLogic.update(gameState);
  }

  createPlanetObject(model) {
    let planetSprite = this.add.sprite(0, 0, "planet");
    let planet = new PlanetObject(model, planetSprite);
    return planet;
  }

  createConnectionObject(model) {
    let connectionSprite = this.add.sprite(0, 0, "planet");
    let connection = new PlanetObject(model, connectionSprite);
    return connection;
  }
}
