import { Utils } from "phaser";

const virusFactor = 0.25; // How fast the virus growth on planets;
let counter = 0;
export class GameLogic {
    static update(gameState) {
        if (counter % 30 == 0) {
            counter = counter + 1;
            GameLogic.updateMoney(gameState);
            GameLogic.updateShips(gameState);
            GameLogic.updateFights(gameState);
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
                    element.growthRate * virusFactor * ((Math.floor(gameState.level / 5) + 1)
                    ));
            }
            if (element.population.player > 0) {
                gameState.player.money += Math.floor(element.growthRate);
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
                this.spread(startPlanet, endPlanet);
            }
            if (
                endPlanet.population.default == 0 &&
                this.isSpreading(element.sendPorbability)
            ) {
                this.spread(endPlanet, startPlanet);
            }
        }
    }

    static isSpreading(sendPorbability) {
        return Utils.getRandomArbitrary(0, 100) < sendPorbability;
    }

    static spread(fromPlanet, toPlanet) {
        if (fromPlanet.population.virus > 1) {
            spreadVirus(fromPlanet, toPlanet);
        }
        if (fromPlanet.population.player > 1) {
            spreadPlayer(fromPlanet, toPlanet);
        }
    }

    static spreadVirus(fromPlanet, toPlanet) {
        var shipFleet = Math.floor(
            (startPlanet.population.virus * element.startPlanet.spreadRate) / 100
        );
        fromPlanet.population.virus -= shipFleet;
        fightPlanetWithVirus(toPlanet, shipFleet);
    }

    static spreadPlayer(fromPlanet, toPlanet) {
        var shipFleet = Math.floor(
            (startPlanet.population.player * element.startPlanet.spreadRate) / 100
        );
        fromPlanet.population.virus -= shipFleet;
        fightPlanetWithPlayer(toPlanet, shipFleet);
    }

    static fightPlanetWithVirus(attackedPlanet, shipFleet) {
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
            attackedPlanet.population.default -= shipFleet;
            if (attackedPlanet.population.default < 0) {
                attackedPlanet.population.virus +=
                    attackedPlanet.population.default * -1;
                attackedPlanet.population.default = 0;
            }
        }
    }

    static fightPlanetWithPlayer(attackedPlanet, shipFleet) {
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
}
