import { Planet } from "./Planet";
import { SpaceConnection } from "./SpaceConnection";
import * as Utils from "./Utils";
var seedrandom = require("seedrandom");

const base_minVirusPopulation = 1000;
const base_maxVirusPopulation = 2500;
const base_minVirusGrowthRate = 1;
const base_maxVirusGrowthRate = 2;
const base_minVirusSpreadRate = 0;
const base_maxVirusSpreadRate = 1;

export class Universe {
    // planets : Array<Planet>
    // spaceConnections: Array<SpaceConnection>

    constructor() {
        this.planets = [];
        this.spaceConnections = [];
    }

    generate(level) {
<<<<<<< HEAD
=======
        console.error("generate level " + level);
        seedrandom("Repairevil" + level, { global: true });
>>>>>>> 7b458b3a6a66bdb189ac8305f9e79c6b8a0df7aa
        let maxX = 1200;
        let maxY = 900;
        let cellX = (maxX / 100) * 2; // 24
        let cellY = (maxY / 100) * 2; // 18
        let maxCell = cellX * cellY;
        let planetAmount = Math.min(
            Utils.getRandomArbitrary(
<<<<<<< HEAD
                Math.floor(level / 2),
                (Math.floor(level / 2) + 1) * 2
            ) + 10,
=======
                Math.floor(level / 5),
                (Math.floor(level / 5) + 1) * 2
            ) + 5,
>>>>>>> 7b458b3a6a66bdb189ac8305f9e79c6b8a0df7aa
            Math.floor(maxCell / 2)
        );

        // Fil array with possible cells
        let freeCells = [];

        for (var i = 0; i < maxCell; i++) {
            freeCells.push(i);
        }

        // Create planets
        for (var i = 0; i < planetAmount; i++) {
            let cellPosition = Utils.getRandomArbitrary(0, freeCells.length);
            let cellIndex = freeCells.indexOf(cellPosition);
            freeCells.splice(cellIndex, 1);

            this.planets.push(new Planet(cellPosition, level));
        }

        // Create connections
        let maxConnectionAmount = Math.min(
            Math.floor(level / 5) + 1,
<<<<<<< HEAD
            Math.floor(planetAmount / 5)
=======
            Math.floor(planetAmount / 2)
>>>>>>> 7b458b3a6a66bdb189ac8305f9e79c6b8a0df7aa
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
<<<<<<< HEAD
            let occupiedPlanetNumber = this.getOccupiedPlanetNumber(occupiedPlanets);
=======
            let occupiedPlanetNumber = this.getOccupiedPlanetNumber(
                occupiedPlanets
            );
>>>>>>> 7b458b3a6a66bdb189ac8305f9e79c6b8a0df7aa
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

            while (connectionAmount > 0) {
                var freePlanetsToConnectTo = [];
                for (var j = 0; j < planetAmount; j++) {
                    if (i != j) {
                        freePlanetsToConnectTo.push(j);
                    }
                }

                let currentPlanet = this.planets[i];
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
<<<<<<< HEAD
                                this.planets.indexOf(spaceConnection.startPlanet)
=======
                                this.planets.indexOf(
                                    spaceConnection.startPlanet
                                )
>>>>>>> 7b458b3a6a66bdb189ac8305f9e79c6b8a0df7aa
                            ),
                            1
                        );
                    }
                });

                if (freePlanetsToConnectTo.length === 0) {
                    // If no free planet is available cancel the operation.
                    connectionAmount = 0;
                } else {
                    let freePlanetNumber = this.getFreePLanetNumber(
                        freePlanetsToConnectTo
                    );

                    this.spaceConnections.push(
<<<<<<< HEAD
                        new SpaceConnection(this.planets[i], this.planets[freePlanetNumber])
=======
                        new SpaceConnection(
                            this.planets[i],
                            this.planets[freePlanetNumber]
                        )
>>>>>>> 7b458b3a6a66bdb189ac8305f9e79c6b8a0df7aa
                    );
                    connectionAmount--;
                }
            }
        }

        this.generateVirus(level);
        this.spawnVirus();
    }

    getFreePLanetNumber(freePlanets) {
        let planetIndex = Utils.getRandomArbitrary(0, freePlanets.length - 1);
        let planetNumber = freePlanets[planetIndex];
        freePlanets.splice(planetIndex, 1);
        return planetNumber;
    }

    getOccupiedPlanetNumber(occupiedPlanets) {
<<<<<<< HEAD
        let planetIndex = Utils.getRandomArbitrary(0, occupiedPlanets.length - 1);
=======
        let planetIndex = Utils.getRandomArbitrary(
            0,
            occupiedPlanets.length - 1
        );
>>>>>>> 7b458b3a6a66bdb189ac8305f9e79c6b8a0df7aa
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
        planet.spreadRate = this.virusSpreadRate;
    }

    generateVirus(level) {
        this.virusPopulation = this.generateVirusPopulation(level);
        this.virusGrowthRate = this.generateVirusGrowthRate(level);
        this.virusSpreadRate = this.generateVirusSpreadRate(level);
    }

    generateVirusPopulation(level) {
        return Utils.getRandomArbitrary(
            base_minVirusPopulation * level,
            base_maxVirusPopulation * level
        );
    }

    generateVirusGrowthRate(level) {
        return Utils.getRandomArbitrary(
            base_minVirusGrowthRate * level,
            base_maxVirusGrowthRate * level
        );
    }

    generateVirusSpreadRate(level) {
        let rate = Utils.getRandomArbitrary(
<<<<<<< HEAD
            base_minVirusSpreadRate + level * 2,
            base_maxVirusSpreadRate + level * 2
        );
        if (rate > 99) {
            rate = 99;
=======
            base_minVirusSpreadRate * level,
            base_maxVirusSpreadRate * level
        );
        if (rate > 100) {
            rate = 100;
>>>>>>> 7b458b3a6a66bdb189ac8305f9e79c6b8a0df7aa
        }
        return rate;
    }
}
