// Local PRNG: does not affect Math.random.
var seedrandom = require('seedrandom');

class Planet {
    constructor(cell) {
        this.cell = cell;
    }
}

class System {
    constructor() {
        this.planetlist = [];
    }

    generateSystem(seed, planetAmount) {
        let rng = seedrandom(seed, {global:true});
        let maxX = 1200;
        let maxY = 900;
        let cellX = maxX / 100 * 2; // 24
        let cellY = maxY / 100 * 2; // 18
        let maxCell = cellX * cellY;

        // Fil array with possible cells
        let freeCells = [];

        for(var i = 0; i < maxCell; i++) {
            freeCells.push(i);
        }


        for(var i = 0; i < planetAmount; i++) {
            console.log("freeCells", freeCells);
            let cellPosition = this.getRandomInt(freeCells.length);
            let cellIndex = freeCells.indexOf(cellPosition);
            freeCells.splice(cellIndex, 1);

            this.planetlist.push(new Planet(cellPosition))
        }
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

let system = new System();
system.generateSystem('Regpairevil', 7);

console.log(system.planetlist);