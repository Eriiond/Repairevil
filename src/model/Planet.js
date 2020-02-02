import { getRandomArbitrary } from "./Utils";
import { GamePhaseIngame } from "./GameState";
import { GameGrid } from "../ui/consts";
import { horizontalCells } from "./Universe";

export const OwnerVirus = "virus";
export const OwnerDefault = "default";
export const OwnerPlayer = "player";

const WEIGHT_VIRUS = 25;
const WEIGHT_DEFAULT = 20;
const WEIGHT_PLAYER = 5;

const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000;

const base_minPopulation = 200;
const base_maxPopulation = 350;
const base_minIncome = ONE_MILLION;
const base_maxIncome = 2500000;
const base_minGrowthRate = 2;
const base_maxGrowthRate = 10;
const base_minSpreadChance = 5;
const base_maxSpreadChance = 25;
const greekLetterList = [
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
    "Lambda",
    "Mu",
    "Nu",
    "Xi",
    "Omicron",
    "Pi",
    "Rho",
    "Sigma",
    "Tau",
    "Upsilon",
    "Phi",
    "Chi",
    "Psi",
    "Omega",
];

export class Planet {
    // name: String
    // position: Number;
    // population: {virus: Number, player: Number, default: Number}
    // income: Number
    // growthRate: Number
    // spreadChance: Number
    // spreadRate: Number
    // upgrades: {income: Number, growthRate: Number, spreadChance: Number }
    // neighbours: <planets>
    // weight: Number

    constructor(position, level) {
        this.name = `${
            greekLetterList[getRandomArbitrary(0, greekLetterList.length - 1)]
            } ${position}`;
        this.minPopulation = base_minPopulation * (Math.floor(level / 2) + 1);
        this.maxPopulation = base_maxPopulation * (Math.floor(level / 2) + 1);
        this.minIncome = base_minIncome * (Math.floor(level / 2) + 1);
        this.maxIncome = base_maxIncome * (Math.floor(level / 2) + 1);
        this.minGrowthRate = base_minGrowthRate * (Math.floor(level / 2) + 1);
        this.maxGrowthRate = base_maxGrowthRate * (Math.floor(level / 2) + 1);
        this.minSpreadChance = base_minSpreadChance;
        this.maxSpreadChance = base_maxSpreadChance;

        if (this.minSpreadChance > 99) {
            this.minSpreadChance = 99;
        }
        if (this.maxSpreadChance > 99) {
            this.maxSpreadChance = 99;
        }

        this.position = position;
        this.population = {};
        this.population.virus = 0;
        this.population.default = this.generatePopulation();
        this.population.player = 0;
        this.income = this.generateIncome();
        this.growthRate = this.generateGrowthRate();
        this.spreadChance = this.generateSpreadChance();
        this.spreadRate = 20;
        this.upgrades = {};
        this.upgrades.income = 0;
        this.upgrades.growthRate = 0;
        this.upgrades.spreadChance = 0;
        this.neighbours = [];
        this.weight = 0;
    }

    generatePopulation() {
        return getRandomArbitrary(this.minPopulation, this.maxPopulation);
    }

    generateIncome() {
        return getRandomArbitrary(this.minIncome, this.maxIncome);
    }

    generateGrowthRate() {
        return getRandomArbitrary(this.minGrowthRate, this.maxGrowthRate);
    }

    generateSpreadChance() {
        return getRandomArbitrary(this.minSpreadChance, this.maxSpreadChance);
    }

    spawnPlayer(gameState) {
        if (!gameState.player.spawned) {
            this.population.player = this.population.default;
            this.population.default = 0;
            this.updateNeighbours();
            gameState.player.spawned = true;
            gameState.gamePhase = GamePhaseIngame;
        }
    }

    upgradeIncome(gameState) {
        var price = this.getIncomePrice();
        if (gameState.player.money >= price && this.population.player > 0) {
            gameState.player.money -= price;
            this.upgrades.income++;
            this.income = Math.floor((this.income * 111) / 100);
        }
    }

    upgradeGrowth(gameState) {
        var price = this.getGrowthPrice();
        if (gameState.player.money >= price && this.population.player > 0) {
            gameState.player.money -= price;
            this.upgrades.growthRate++;
            this.growthRate =
                Math.round(((this.growthRate * 106) / 100) * 100) / 100;
        }
    }

    upgradeSpread(gameState) {
        var price = this.getSpreadPrice();
        if (
            gameState.player.money >= price &&
            this.population.player > 0 &&
            this.spreadChance < 99
        ) {
            gameState.player.money -= price;
            this.upgrades.spreadChance++;
            this.spreadChance =
                Math.round(((this.spreadChance * 102) / 100) * 100) / 100;
            if (this.spreadChance > 99) {
                this.spreadChance = 99;
            }
        }
    }

    getIncomePrice() {
        return ONE_MILLION * (1 + 2 ** this.upgrades.income);
    }

    getGrowthPrice() {
        return ONE_MILLION * (1 + this.upgrades.growthRate ** 2);
    }

    getSpreadPrice() {
        return ONE_MILLION * (1 + 2 * this.upgrades.spreadChance);
    }

    getPosition() {
        let xPos = this.position % horizontalCells;
        let yPos = Math.floor(this.position / horizontalCells);
        let x = GameGrid.margin + (xPos + 0.5) * GameGrid.cellWidth;
        let y = GameGrid.margin + (yPos + 0.5) * GameGrid.cellHeight;
        return [x, y];
    }

    getOwner() {
        return this.population.virus > 0
            ? OwnerVirus
            : this.population.player > 0
                ? OwnerPlayer
                : OwnerDefault;
    }

    getPopulation() {
        let owner = this.getOwner();
        return owner ? this.population[owner] : "0";
    }

    saveNeighbours(universe) {
        for (let i = 0; i < universe.spaceConnections.length; i++) {
            const element = universe.spaceConnections[i];
            if (element.startPlanet == this) {
                this.neighbours.push(element.endPlanet);
            }
            if (element.endPlanet == this) {
                this.neighbours.push(element.startPlanet);
            }
        }
    }

    updateNeighbours() {
        this.neighbours.forEach(e => {
            e.resetWeight();
        });
    }

    getNeightbours() {
        return this.neighbours;
    }

    resetWeight() {
        var w = this.getWeightValue(this);
        for (let i = 0; i < this.neighbours.length; i++) {
            const element = this.neighbours[i];
            w += this.getWeightValue(element);
        }
        this.weight = w;
    }

    getWeightValue(planet) {
        switch (planet.getOwner()) {
            case OwnerVirus:
                return WEIGHT_VIRUS;
                break;
            case OwnerDefault:
                return WEIGHT_DEFAULT;
                break;
            case OwnerPlayer:
                return WEIGHT_PLAYER;
                break;
            default:
                console.log("Switch Case - Error in getWeightValue(planet)");
        }
    }
}
