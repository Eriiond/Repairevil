import Phaser from "phaser";
import GameScene from "./scenes/Game";
import config from "./config";

var seedrandom = require("seedrandom");

const gameConfig = Object.assign(config, {
  scene: [GameScene]
});

class Game extends Phaser.Game {
  constructor() {
    seedrandom("Repairevil", { global: true });
    super(gameConfig);
  }
}

window.game = new Game();
