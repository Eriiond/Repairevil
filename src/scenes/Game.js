import Phaser from "phaser";
import { PlanetObject } from "../ui/PlanetObject";
import { ConnectionObject } from "../ui/ConnectionObject";
import { Player } from "../model/Player";
import {
    GameState,
    GamePhaseIngame,
    GamePhaseEnd,
    GamePhaseChooseBase,
} from "../model/GameState";
import { Universe } from "../model/Universe";
import { GameLogic } from "../model/GameLogic";
import { setupInfoArea, updateInfoArea } from "../ui/InfoArea";
import { Viewport } from "../ui/consts";
import { OwnerPlayer } from "../model/Planet";
import { InputManager } from "../ui/InputManager";

export default class extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });

        this.level = 10;

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
        this.onEndGame = this.onEndGame.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.startLevel = this.startLevel.bind(this);
        this.selectNextPlanet = this.selectNextPlanet.bind(this);
    }

    preload() {
        this.load.image("planet", "src/assets/planet.png");
        this.load.image("galaxy", "src/assets/galaxy.jpg");
        this.load.image("virus", "src/assets/virus.png");
        this.load.image("cure", "src/assets/cure.png");
    }

    create() {
        const callbacks = {
            onA: () => this.onUpgradeGrowth(),
            onS: () => this.onUpgradeIncome(),
            onD: () => this.onUpgradeSpread(),
            onF: () => this.onBaseChosen(),
            onTab: () => this.selectNextPlanet(),
            onSpaceDown: () => this.showSpaceConnections(),
            onSpaceUp: () => this.hideSpaceConnections(),
        };
        this.inputManager = new InputManager(this, callbacks);

        this.setupUI();
        this.endGameText = this.add.text(
            (Viewport.width * 3) / 4 / 2,
            Viewport.height / 3,
            "",
            {
                fontFamily: '"Roboto Condensed"',
                fontSize: 50,
                color: "#ffffff",
            }
        );
        this.endGameText.setOrigin(0.5, 0);

        this.startLevel(this.level);
    }

    destroy() {
        this.selectedObject = null;
        this.planetObjects && this.planetObjects.forEach(p => p.destroy());
        this.connectionObjects &&
            this.connectionObjects.forEach(c => c.destroy());
    }

    startLevel(level) {
        let universe = new Universe();
        universe.generate(level);
        let player = new Player();
        this.gameState = new GameState(universe, player, level);

        this.connectionObjects = this.gameState.universe.spaceConnections.map(
            c => this.createConnectionObject(c)
        );

        this.planetObjects = this.gameState.universe.planets.map(p =>
            this.createPlanetObject(p)
        );

        this.setupSelectBase();

        this.gameState.gamePhase = GamePhaseChooseBase;
        this.endGameText.visible = false;
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
        this.eventEmitter.on("endGame", this.onEndGame);

        this.eventEmitter.on(
            "spread",
            (fromPlanet, toPlanet, shipFleet, owner) => {
                let fromPlanetPosition = fromPlanet.getPosition();
                let toPlanetPosition = toPlanet.getPosition();

                let path = new Phaser.Curves.Path(
                    fromPlanetPosition[0],
                    fromPlanetPosition[1]
                );

                path.lineTo(toPlanetPosition[0], toPlanetPosition[1]);

                let delay = 50;
                let duration = 1000;

                let connectionObjectList = this.connectionObjects.filter(
                    connectionObject => {
                        let startPlanet = connectionObject.model.startPlanet;
                        let endPlanet = connectionObject.model.endPlanet;
                        return (
                            (fromPlanet == startPlanet ||
                                toPlanet == startPlanet) &&
                            (fromPlanet == endPlanet || toPlanet == endPlanet)
                        );
                    }
                );

                if (connectionObjectList.length == 1) {
                    let c = connectionObjectList[0];
                    c.draw(this, owner);
                }

                let sprite = "virus";

                if (owner == OwnerPlayer) {
                    sprite = "cure";
                }

                for (var i = 0; i < shipFleet / 200; i++) {
                    var follower = this.add.follower(path, 0, 0, sprite);

                    follower.startFollow({
                        duration: duration,
                        positionOnPath: true,
                        repeat: 0,
                        ease: "Sine.easeInOut",
                        delay: i * delay,
                    });

                    setTimeout(
                        f => {
                            f.destroy();
                        },
                        duration + i * delay,
                        follower
                    );
                }
            }
        );

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
            onUpgradeSpread: this.onUpgradeSpread,
        };
        let graphics = this.add.graphics({ fillStyle: { color: 0xa0a0a0 } });
        setupInfoArea(this, infoAreaCallbacks, graphics);
    }

    onEndGame(won) {
        if (this.gameState.gamePhase !== GamePhaseIngame) {
            return;
        }

        console.error("Game.onEndGame:", won);
        this.gameState.gamePhase = GamePhaseEnd;
        if (won) {
            this.endGameText.setText("You won!");
            this.level = this.level + 1;
        } else {
            this.endGameText.setText("Try again");
        }
        this.endGameText.visible = true;
        setTimeout(this.restartGame, 3000);
    }

    restartGame() {
        this.destroy();
        this.startLevel(this.level);
    }

    onUpgradeGrowth() {
        if (!this.selectedObject) {
            return;
        }
        this.selectedObject.model.upgradeGrowth(this.gameState);
        this.updateUI();
    }

    onUpgradeIncome() {
        if (!this.selectedObject) {
            return;
        }
        this.selectedObject.model.upgradeIncome(this.gameState);
        this.updateUI();
    }

    onUpgradeSpread() {
        if (!this.selectedObject) {
            return;
        }
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

        // let keyDownA = false
        // this.input.keyboard.on("keydown-A", () => {
        //     console.log("!!!");
        // });
    }

    onUnselect() {
        this.selectedObject = null;

        this.clearDrawedSpaceConnection();
    }

    updateUI() {
        updateInfoArea(this.selectedObject, this.gameState);
    }

    onPlanetSelected(planetObject) {
        this.clearDrawedSpaceConnection();
        let planet = planetObject.model;
        let connectionObjects = this.connectionObjects.filter(
            spaceConnection => {
                return (
                    spaceConnection.model.startPlanet == planet ||
                    spaceConnection.model.endPlanet == planet
                );
            }
        );
        connectionObjects.forEach(c => c.draw(this));
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

    clearDrawedSpaceConnection() {
        this.connectionObjects &&
            this.connectionObjects.forEach(c => c.destroyDefaultLine());
    }

    selectNextPlanet() {
        const index = this.planetObjects.findIndex(
            p => p === this.selectedObject
        );
        let nextIndex = index + 1;
        if (nextIndex == this.planetObjects.length) {
            nextIndex = 0;
        }
        this.selectedObject = this.planetObjects[nextIndex];
        this.onPlanetSelected(this.planetObjects[nextIndex]);
    }
}
