import { Planet } from "./Planet";
import { SpaceConnection } from "./SpaceConnection";
import * as Utils from "./Utils";

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
    let planetAmount = (level % 5) + 5;

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
    let maxConnectionAmount = (level % 5) + 1;

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
          let freePlanetNumber = getFreePLanetNumber(freePlanetsToConnectTo);

          this.spaceConnections.push(
            new SpaceConnection(this.planets[i], this.planets[freePlanetNumber])
          );
          connectionAmount--;
        }
      }
    }
  }

  getFreePLanetNumber(freePlanets) {
    let planetNumber = Utils.getRandomArbitrary(0, freePlanets.length - 1);
    freePlanets.splice(freePlanets.indexOf(planetNumber), 1);
    return planetNumber;
  }

  getOccupiedPlanetNumber(occupiedPlanets) {
    let planetNumber = Utils.getRandomArbitrary(0, occupiedPlanets.length - 1);
    return planetNumber;
  }
}
