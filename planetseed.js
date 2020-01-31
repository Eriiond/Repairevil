// Local PRNG: does not affect Math.random.
var seedrandom = require('seedrandom');

class Planet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equalPosition(planet) {
        return this.x == planet.x && this.y == planet.y;
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
        let maxCell = cellX * cellY

        // Fil array with possible cells
        let freeCells = [];

        for(var i = 0; i < maxCell; i++) {

        }

        for(var i = 0; i < planetAmount; i++) {
            let x = this.getRandomInt(cellX);
            let y = this.getRandomInt(cellY);

            if (this.addPlanet(new Planet(x, y)) == false) {
                // Created planet was rejected.
                i--;
            }
        }
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    addPlanet(planet) {
        // Reject a planet with occupied positiion.
        if (this.containsPlanet(planet)) {
            return false;
        }

        return this.planetlist.push(planet);
    }

    containsPlanet(planet) {
        let test = this.planetlist.find((p) => {
            return planet.equalPosition(p);
        });
        return typeof test == "object";
    }
}

let system = new System();
system.generateSystem('Regpairevil', 7);

console.log(system.planetlist);