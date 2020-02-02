import { Planet } from "./Planet";
import { SpaceConnection } from "./SpaceConnection";
import * as Utils from "./Utils";
var seedrandom = require("seedrandom");

export const horizontalCells = 20;
export const verticalCells = 15;

const virusDivider = 4; // Level / Divider for each penalty
const virusMultiplier = 1.11; // Level * Multiplier for each buff

const base_minVirusPopulation = 1000;
const base_maxVirusPopulation = 2500;
const base_minVirusGrowthRate = 10;
const base_maxVirusGrowthRate = 20;
const base_minVirusSpreadChance = 2;
const base_maxVirusSpreadChance = 8;

export class Universe {
    // planets : Array<Planet>
    // spaceConnections: Array<SpaceConnection>

    constructor() {
        this.planets = [];
        this.spaceConnections = [];
    }

    generate(seed, level) {
        seedrandom(seed + level, { global: true });
        let maxCell = horizontalCells * verticalCells;
        let planetAmount = Math.min(
            Utils.getRandomArbitrary(
                Math.floor(level / 2),
                (Math.floor(level / 2) + 1) * 3
            ) + 5,
            Math.floor(maxCell / 2)
        );

        // Fil array with possible cells
        let freeCells = [];

        for (var i = 0; i < maxCell; i++) {
            freeCells.push(i);
        }

        // Create planets
        for (var i = 0; i < planetAmount; i++) {
            let cellIndex = Utils.getRandomArbitrary(0, freeCells.length);
            let cellPosition = freeCells[cellIndex];
            freeCells.splice(cellIndex, 1);

            this.planets.push(new Planet(cellPosition, level));
        }

        // Create connections
        let maxConnectionAmount = Math.min(
            Math.floor(level / 5) + 1,
            Math.floor(planetAmount / 5)
        );

        let freePlanets = [];
        let occupiedPlanets = [];

        for (var i = 0; i < planetAmount; i++) {
            freePlanets.push(i);
        }

        let firstOccupiedPlanetNumber = this.getFreePLanetNumber(freePlanets);
        occupiedPlanets.push(firstOccupiedPlanetNumber);

        // Connect each free planet with an occupied planet
        while (freePlanets.length > 0) {
            let occupiedPlanetNumber = this.getOccupiedPlanetNumber(
                occupiedPlanets
            );
            let freePlanetNumber = this.getFreePLanetNumber(freePlanets);
            occupiedPlanets.push(freePlanetNumber);

            this.spaceConnections.push(
                new SpaceConnection(
                    this.planets[freePlanetNumber],
                    this.planets[occupiedPlanetNumber]
                )
            );
        }

        // Create remaining connections
        for (var i = 0; i < planetAmount; i++) {
            let connectionAmount = Utils.getRandomArbitrary(
                0,
                maxConnectionAmount - 1
            );

            let currentPlanet = this.planets[i];
            let currentPlanetSpaceConnections = this.getSpaceConnections(
                currentPlanet
            );

            let currentPlanetRemainingSpaceConnectionAmount =
                connectionAmount - currentPlanetSpaceConnections.length;

            while (currentPlanetRemainingSpaceConnectionAmount > 0) {
                var freePlanetsToConnectTo = [];
                for (var j = 0; j < planetAmount; j++) {
                    if (i != j) {
                        freePlanetsToConnectTo.push(j);
                    }
                }

                this.spaceConnections.forEach(spaceConnection => {
                    if (spaceConnection.startPlanet == currentPlanet) {
                        freePlanetsToConnectTo.splice(
                            freePlanetsToConnectTo.indexOf(
                                this.planets.indexOf(spaceConnection.endPlanet)
                            ),
                            1
                        );
                    } else if (spaceConnection.endPlanet == currentPlanet) {
                        freePlanetsToConnectTo.splice(
                            freePlanetsToConnectTo.indexOf(
                                this.planets.indexOf(
                                    spaceConnection.startPlanet
                                )
                            ),
                            1
                        );
                    }
                });

                if (freePlanetsToConnectTo.length === 0) {
                    // If no free planet is available cancel the operation.
                    currentPlanetRemainingSpaceConnectionAmount = 0;
                } else {
                    let freePlanetNumber = this.getFreePLanetNumber(
                        freePlanetsToConnectTo
                    );

                    this.spaceConnections.push(
                        new SpaceConnection(
                            this.planets[i],
                            this.planets[freePlanetNumber]
                        )
                    );
                    currentPlanetRemainingSpaceConnectionAmount--;
                }
            }
        }

        // generate Virus
        this.generateVirus(level);
        this.spawnVirus();

        // save all neighbours
        this.planets.forEach(e => {
            e.saveNeighbours(this);
            e.resetWeight();
        });
    }

    getFreePLanetNumber(freePlanets) {
        let planetIndex = Utils.getRandomArbitrary(0, freePlanets.length - 1);
        let planetNumber = freePlanets[planetIndex];
        freePlanets.splice(planetIndex, 1);
        return planetNumber;
    }

    getOccupiedPlanetNumber(occupiedPlanets) {
        let planetIndex = Utils.getRandomArbitrary(
            0,
            occupiedPlanets.length - 1
        );
        let planetNumber = occupiedPlanets[planetIndex];
        return planetNumber;
    }

    getRandomPlanet() {
        var occupiedPlanets = [];
        for (var i = 0; i < this.planets.length; i++) {
            occupiedPlanets.push(i);
        }
        return this.planets[this.getOccupiedPlanetNumber(occupiedPlanets)];
    }

    spawnVirus() {
        var planet = this.getRandomPlanet();
        planet.population.default = 0;
        planet.population.virus = this.virusPopulation;
        planet.growthRate = this.virusGrowthRate;
        planet.spreadChance = this.virusSpreadChance;
    }

    generateVirus(level) {
        this.virusPopulation = this.generateVirusPopulation(level);
        this.virusGrowthRate = this.generateVirusGrowthRate(level);
        this.virusSpreadChance = this.generateVirusSpreadChance(level);
    }

    generateVirusPopulation(level) {
        return Utils.getRandomArbitrary(
            Math.floor(base_minVirusPopulation * level * virusMultiplier),
            Math.floor(base_maxVirusPopulation * level * virusMultiplier)
        );
    }

    generateVirusGrowthRate(level) {
        return Utils.getRandomArbitrary(
            Math.floor(base_minVirusGrowthRate * level * virusMultiplier),
            Math.floor(base_maxVirusGrowthRate * level * virusMultiplier)
        );
    }

    generateVirusSpreadChance(level) {
        let rate = Utils.getRandomArbitrary(
            Math.floor(base_minVirusSpreadChance + level * virusMultiplier * 2),
            Math.floor(base_maxVirusSpreadChance + level * virusMultiplier * 2)
        );
        if (rate > 99) {
            rate = 99;
        }
        return rate;
    }

    getSpaceConnections(planet) {
        let spaceConnections = [];
        this.spaceConnections.forEach(spaceConnection => {
            if (
                spaceConnection.startPlanet == planet ||
                spaceConnection.endPlanet == planet
            ) {
                spaceConnections.push(spaceConnection);
            }
        });

        return spaceConnections;
    }
}
