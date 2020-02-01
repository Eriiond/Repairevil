import Phaser from "phaser";
import { PlanetObject } from "../ui/PlanetObject";
import { ConnectionObject } from "../ui/ConnectionObject";
import { Player } from "../model/Player";
import { GameState, GamePhaseIngame } from "../model/GameState";
import { Universe } from "../model/Universe";
import { GameLogic } from "../model/GameLogic";
import { setupInfoArea, updateInfoArea } from "../ui/InfoArea";
import { colors } from "../ui/consts";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.level = 1;

    this.selectedObject = null;
    this.planetObjects = Array();
    this.frameCounter = 0;

    this.eventEmitter = new Phaser.Events.EventEmitter();
    GameLogic.setEventEmitter(this.eventEmitter);

    this.onUpgradeGrowth = this.onUpgradeGrowth.bind(this);
    this.onUpgradeIncome = this.onUpgradeIncome.bind(this);
    this.onUpgradeSpread = this.onUpgradeSpread.bind(this);
    this.onUnselect = this.onUnselect.bind(this);
    this.update = this.update.bind(this);
    this.updateUI = this.updateUI.bind(this);
    this.onPlanetClicked = this.onPlanetClicked.bind(this);
    this.onBaseChosen = this.onBaseChosen.bind(this);
    this.onPlanetSelected = this.onPlanetSelected.bind(this);
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
    this.gameState = new GameState(universe, player, this.level);

    this.connectionObjects = this.gameState.universe.spaceConnections.map(c =>
      this.createConnectionObject(c)
    );
    this.connectionObjects.forEach(c => c.draw(this));

    this.setupSelectBase();

    this.eventEmitter.on("spreadVirus", (fromPlanet, toPlanet, shipFleet) => {
      let graphics = this.add.graphics();
      let follower = { t: 0, vec: new Phaser.Math.Vector2() };

      let fromPlanetPosition = fromPlanet.getPosition();
      let toPlanetPosition = toPlanet.getPosition();

      let path = new Phaser.Curves.Path(
        fromPlanetPosition[0],
        fromPlanetPosition[1]
      );

      path.lineTo(toPlanetPosition[0], toPlanetPosition[1]);

      let refreshRate = 50;
      let duration = 1000;

      this.tweens.add({
        targets: follower,
        t: 1,
        ease: "Sine.easeInOut",
        duration: duration,
        yoyo: false,
        repeat: 0
      });

      let timerId = setInterval(() => {
        graphics.clear();
        //graphics.lineStyle(1, colors.connectionVirusColor, 1);

        path.draw(graphics);

        path.getPoint(follower.t, follower.vec);

        graphics.fillStyle(colors.connectionVirusColor, 1);
        graphics.fillCircle(follower.vec.x, follower.vec.y, shipFleet / 1000);
      }, refreshRate);

      setTimeout(() => {
        clearInterval(timerId);
        graphics.destroy();
      }, duration);
    });

    this.planetObjects = this.gameState.universe.planets.map(p =>
      this.createPlanetObject(p)
    );
  }

  setupSelectBase() {
    this.eventEmitter.removeAllListeners();
    this.eventEmitter.on("planetClicked", this.onPlanetClicked);
    this.eventEmitter.on("planetSelected", this.onPlanetSelected);
    this.eventEmitter.on("choosePlanetClicked", this.onBaseChosen);
    updateInfoArea(this.selectedObject, this.gameState);
  }

  setupIngame() {
    this.eventEmitter.removeAllListeners();
    this.eventEmitter.on("planetClicked", this.onPlanetClicked);
    this.eventEmitter.on("planetSelected", this.onPlanetSelected);
    this.eventEmitter.on("gameStep", this.updateUI);

    updateInfoArea(this.selectedObject, this.gameState);
    this.eventEmitter.emit("planetSelected", this.selectedObject);
  }

  onBaseChosen() {
    if (this.selectedObject) {
      this.selectedObject.model.spawnPlayer(this.gameState);
      this.setupIngame();
    } else console.error("no planet is selected");
  }

  setupUI() {
    let background = this.add.sprite(800, 450, "galaxy");
    background.on("pointerup", this.onUnselect);
    background.setInteractive();

    const infoAreaCallbacks = {
      onUpgradeGrowth: this.onUpgradeGrowth,
      onUpgradeIncome: this.onUpgradeIncome,
      onUpgradeSpread: this.onUpgradeSpread
    };
    let graphics = this.add.graphics({ fillStyle: { color: 0xa0a0a0 } });
    setupInfoArea(this, infoAreaCallbacks, graphics);
  }

  onUpgradeGrowth() {
    this.selectedObject.model.upgradeGrowth(this.gameState);
    this.updateUI();
  }

  onUpgradeIncome() {
    this.selectedObject.model.upgradeIncome(this.gameState);
    this.updateUI();
  }

  onUpgradeSpread() {
    this.selectedObject.model.upgradeSpread(this.gameState);
    this.updateUI();
  }

  onPlanetClicked(planetObject) {
    this.selectedObject = planetObject;
    this.eventEmitter.emit("planetSelected", planetObject);
  }

  update() {
    if (this.gameState.gamePhase == GamePhaseIngame) {
      GameLogic.update(this.gameState, this.eventEmitter);
    }
    this.planetObjects.forEach(p => p.draw(p === this.selectedObject));
    updateInfoArea(this.selectedObject, this.gameState);
  }

  onUnselect() {
    // this.selectedObject && this.selectedObject.reset();
    this.selectedObject = null;
  }

  updateUI() {
    updateInfoArea(this.selectedObject, this.gameState);
  }

  onPlanetSelected(planetObject) {
    // this.planetObjects
    //   .filter(p => p !== this.selectedObject)
    //   .forEach(p => p.reset());
    // this.selectedObject.onSelected();
  }

  createPlanetObject(model) {
    let sprite = this.add.sprite(0, 0, "planet");
    let planet = new PlanetObject(model, sprite);
    sprite.on("pointerup", () =>
      this.eventEmitter.emit("planetClicked", planet)
    );
    planet.init(this);
    return planet;
  }

  createConnectionObject(model) {
    let connection = new ConnectionObject(model);
    connection.init(this);
    return connection;
  }

  // handleGameEvent(eventType, args) {
  //   switch (eventType) {
  //     case "spread": {
  //     }
  //   }
  // }
}
