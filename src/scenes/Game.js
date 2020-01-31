/* globals __DEV__ */
import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("planet", "src/assets/planet.png");
    this.load.image("galaxy", "src/assets/background.jpg");
  }

  create() {
    //  A simple background for our game
    this.add.image(500, 300, "galaxy");

    //  The planets group contains the ground and the 2 ledges we can jump on
    this.planets = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    this.planets
      .create(64, 64, "planet")
      .setScale(0.1)
      .refreshBody();
  }

  update() {
    // GameLogic.update(gameState);
  }
}
