import { Planet } from "./Planet";
import { SpaceConnection } from "./SpaceConnection";
import * as Utils from "./Utils";

const base_minVirusPopulation = 1000;
const base_maxVirusPopulation = 10000;
const base_minVirusGrowthRate = 1;
const base_maxVirusGrowthRate = 10;
const base_minVirusSpreadRate = 1;
const base_maxVirusSpreadRate = 100;

export class Universe {
  // planets : Array<Planet>
  // spaceConnections: Array<SpaceConnection>

  constructor() {
    this.planets = [];
    this.spaceConnections = [];
  }

  generate(level) {
    let maxX = 1200;
    let maxY = 900;
    let cellX = (maxX / 100) * 2; // 24
    let cellY = (maxY / 100) * 2; // 18
    let maxCell = cellX * cellY;
    let planetAmount = Math.min(
      Utils.getRandomArbitrary(
        Math.floor(level / 5),
        (Math.floor(level / 5) + 1) * 2
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
      let cellPosition = Utils.getRandomArbitrary(0, freeCells.length);
      let cellIndex = freeCells.indexOf(cellPosition);
      freeCells.splice(cellIndex, 1);

      this.planets.push(new Planet(cellPosition, level));
    }

    // Create connections
    let maxConnectionAmount = Math.min(
      Math.floor(level / 5) + 1,
      Math.floor(planetAmount / 2)
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
      let occupiedPlanetNumber = this.getOccupiedPlanetNumber(occupiedPlanets);
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
                this.planets.indexOf(spaceConnection.startPlanet)
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
            new SpaceConnection(this.planets[i], this.planets[freePlanetNumber])
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
    let planetIndex = Utils.getRandomArbitrary(0, occupiedPlanets.length - 1);
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
    console.log("planet.population.virus", planet.population.virus);
    planet.growthRate = this.virusGrowthRate;
    planet.spreadRate = this.virusSpreadRate;
  }

  generateVirus(level) {
    this.virusPopulation = this.generateVirusPopulation(level);
    this.virusGrowthRate = this.generateVirusGrowthRate(level);
    this.virusSpreadRate = this.generateVirusSpreadRate(level);
  }

  generateVirusPopulation(level) {
    return Utils.getRandomArbitrary(base_minVirusPopulation * level, base_maxVirusPopulation * level);
  }

  generateVirusGrowthRate(level) {
    return Utils.getRandomArbitrary(base_minVirusGrowthRate * level, base_maxVirusGrowthRate * level);
  }

  generateVirusSpreadRate(level) {
    let rate = Utils.getRandomArbitrary(base_minVirusSpreadRate * level, base_maxVirusSpreadRate * level);
    if (rate > 100) {
      rate = 100;
    }
    return rate;
  }
}