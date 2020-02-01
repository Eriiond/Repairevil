import Planet from "./Planet";
import SpaceConnections from "./SpaceConnections";

export class Universe {
  // planets : Array<Planet>
  // spaceConnections: Array<SpaceConnection>

    constructor() {
        this.planets = [];
        this.spaceConnections = [];
    }

    generate(seed, level) {
        let maxX = 1200;
        let maxY = 900;
        let cellX = maxX / 100 * 2; // 24
        let cellY = maxY / 100 * 2; // 18
        let maxCell = cellX * cellY;
        let planetAmount = level % 5 + 5;

        // Fil array with possible cells
        let freeCells = [];

        for(var i = 0; i < maxCell; i++) {
            freeCells.push(i);
        }

        // Create planets
        for(var i = 0; i < planetAmount; i++) {
            let cellPosition = this.getRandomArbitrary(0, freeCells.length);
            let cellIndex = freeCells.indexOf(cellPosition);
            freeCells.splice(cellIndex, 1);

            this.planets.push(new Planet(cellPosition));
        }

        // Create connections
        let maxConnectionAmount = level % 5 + 1
        let connectionAmount = this.getRandomArbitrary(1, maxConnections);
    }
}
