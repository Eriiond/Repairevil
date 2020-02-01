import { getRandomArbitrary } from "../model/Utils";
import { OwnerPlayer, OwnerVirus } from "./Planet";

const virusFactor = 0.33; // How fast the virus growth on planets
const virusPanalty = 6; // Initial value that the virus needs to fight default
const virusDivider = 4; // Level / Divider for each penalty

let counter = 0;
let eventEmitter;
export class GameLogic {
    static update(gameState) {
        counter = counter + 1;
        if (counter % 30 == 0) {
            console.log("update");
            GameLogic.updateMoney(gameState);
            GameLogic.updateShips(gameState);
            GameLogic.updateFights(gameState);
            eventEmitter.emit("gameStep");
        }
    }

    static updateMoney(gameState) {
        for (let i = 0; i < gameState.universe.planets.length; i++) {
            const element = gameState.universe.planets[i];
            if (element.population.player > 0) {
                gameState.player.money += element.income;
            }
        }
    }

    static updateShips(gameState) {
        for (let i = 0; i < gameState.universe.planets.length; i++) {
            const element = gameState.universe.planets[i];
            if (element.population.virus > 0) {
                element.population.virus += Math.floor(
                    element.growthRate *
                    virusFactor *
                    (Math.floor(gameState.level / virusDivider) + 1)
                );
            }
            if (element.population.player > 0) {
                element.population.player += Math.floor(element.growthRate);
            }
        }
    }

    static updateFights(gameState) {
        for (let i = 0; i < gameState.universe.spaceConnections.length; i++) {
            const element = gameState.universe.spaceConnections[i];
            const startPlanet = element.startPlanet;
            const endPlanet = element.endPlanet;
            if (
                startPlanet.population.default == 0 &&
                this.isSpreading(element.sendPorbability)
            ) {
                this.spread(startPlanet, endPlanet, gameState);
            }
            if (
                endPlanet.population.default == 0 &&
                this.isSpreading(element.sendPorbability)
            ) {
                this.spread(endPlanet, startPlanet, gameState);
            }
        }
    }

    static isSpreading(sendPorbability) {
        return getRandomArbitrary(0, 100) < sendPorbability;
    }

    static spread(fromPlanet, toPlanet, gameState) {
        if (fromPlanet.population.virus > 1) {
            this.spreadVirus(fromPlanet, toPlanet, gameState);
            this.checkEndCondition(gameState);
        }
        if (fromPlanet.population.player > 1) {
            this.spreadPlayer(fromPlanet, toPlanet, gameState);
            this.checkEndCondition(gameState);
        }
    }

    static spreadVirus(fromPlanet, toPlanet, gameState) {
        var shipFleet = Math.floor(
            (fromPlanet.population.virus * fromPlanet.spreadRate) / 100
        );

        eventEmitter.emit(
            "spread",
            fromPlanet,
            toPlanet,
            shipFleet,
            OwnerVirus
        );

        fromPlanet.population.virus -= shipFleet;
        this.fightPlanetWithVirus(toPlanet, shipFleet, gameState);
    }

    static spreadPlayer(fromPlanet, toPlanet, gameState) {
        var shipFleet = Math.floor(
            (fromPlanet.population.player * fromPlanet.spreadRate) / 100
        );

        eventEmitter.emit(
            "spread",
            fromPlanet,
            toPlanet,
            shipFleet,
            OwnerPlayer
        );

        fromPlanet.population.player -= shipFleet;
        this.fightPlanetWithPlayer(toPlanet, shipFleet, gameState);
    }

    static fightPlanetWithVirus(attackedPlanet, shipFleet, gameState) {
        // planet is unowned
        if (
            attackedPlanet.population.virus == 0 &&
            attackedPlanet.population.player == 0 &&
            attackedPlanet.population.default == 0
        ) {
            attackedPlanet.population.virus += shipFleet;
        }
        // planet is owned by virus itself
        if (attackedPlanet.population.virus > 0) {
            attackedPlanet.population.virus += shipFleet;
        }
        // planet is owned by player
        if (attackedPlanet.population.player > 0) {
            attackedPlanet.population.player -= shipFleet;
            if (attackedPlanet.population.player < 0) {
                attackedPlanet.population.virus +=
                    attackedPlanet.population.player * -1;
                attackedPlanet.population.player = 0;
            }
        }
        // planet is owned by default
        if (attackedPlanet.population.default > 0) {
            attackedPlanet.population.default -= this.getVirusPanalty(shipFleet, gameState);
            if (attackedPlanet.population.default < 0) {
                attackedPlanet.population.virus +=
                    attackedPlanet.population.default * -1;
                attackedPlanet.population.default = 0;
            }
        }
    }

    static getVirusPanalty(shipFleet, gameState) {
        var divideOfTheDown = (virusPanalty - Math.floor(gameState.level / virusDivider));
        if (divideOfTheDown <= 1) {
            divideOfTheDown = 1;
        }
        return Math.floor(shipFleet / divideOfTheDown);
    }

    static fightPlanetWithPlayer(attackedPlanet, shipFleet, gameState) {
        // planet is unowned
        if (
            attackedPlanet.population.virus == 0 &&
            attackedPlanet.population.player == 0 &&
            attackedPlanet.population.default == 0
        ) {
            attackedPlanet.population.player += shipFleet;
        }
        // planet is owned by player itself
        if (attackedPlanet.population.player > 0) {
            attackedPlanet.population.player += shipFleet;
        }
        // planet is owned by virus
        if (attackedPlanet.population.virus > 0) {
            attackedPlanet.population.virus -= shipFleet;
            if (attackedPlanet.population.virus < 0) {
                attackedPlanet.population.player +=
                    attackedPlanet.population.virus * -1;
                attackedPlanet.population.virus = 0;
            }
        }
        // planet is owned by default
        if (attackedPlanet.population.default > 0) {
            attackedPlanet.population.default -= shipFleet;
            if (attackedPlanet.population.default < 0) {
                attackedPlanet.population.player +=
                    attackedPlanet.population.default * -1;
                attackedPlanet.population.default = 0;
            }
        }
    }

    static checkEndCondition(gameState) {
        var player = "dead";
        var virus = "dead";
        for (let i = 0; i < gameState.universe.planets.length; i++) {
            const element = gameState.universe.planets[i];
            if (element.population.virus > 0) {
                virus = "alive";
            }
            if (element.population.player > 0) {
                player = "alive";
            }
        }
        if (player == "dead") {
            eventEmitter.emit("endGame", false);
        } else if (virus == "dead") {
            eventEmitter.emit("endGame", true);
        }
    }

    static setEventEmitter(ee) {
        eventEmitter = ee;
    }

    static getCurrentIncome(gameState) {
        return (
            gameState.universe.planets
                .filter(p => p.getOwner() === OwnerPlayer)
                .map(p => p.income)
                .reduce((acc, i) => acc + i, 0) || 0
        );
    }
}
