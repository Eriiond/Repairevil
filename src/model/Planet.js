import { getRandomArbitrary } from "./Utils";
import { Utils } from "phaser";

const base_minPopulation = 100;
const base_maxPopulation = 1000;
const base_minIncome = 1000000;
const base_maxIncome = 2500000;
const base_minGrowthRate = 1;
const base_maxGrowthRate = 10;
const base_minSpreadRate = 1;
const base_maxSpreadRate = 20;
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
  "Omega"
];

export class Planet {
  // name: String
  // position: Number;
  // population: {virus: Number, player: Number, default: Number}
  // income: Number
  // growthRate: Number
  // spreadRate: Number
  // upgrades: {income: Number, growthRate: Number, spreadRate: Number }

  constructor(position, level) {
    this.name = `${
      greekLetterList[getRandomArbitrary(0, greekLetterList.length - 1)]
      } ${position}`;
    this.minPopulation = base_minPopulation * (Math.floor(level / 5) + 1);
    this.maxPopulation = base_maxPopulation * (Math.floor(level / 5) + 1);
    this.minIncome = base_minIncome * (Math.floor(level / 5) + 1);
    this.maxIncome = base_maxIncome * (Math.floor(level / 5) + 1);
    this.minGrowthRate = base_minGrowthRate * (Math.floor(level / 5) + 1);
    this.maxGrowthRate = base_maxGrowthRate * (Math.floor(level / 5) + 1);
    this.minSpreadRate = base_minSpreadRate * (Math.floor(level / 5) + 1);
    this.maxSpreadRate = base_maxSpreadRate * (Math.floor(level / 5) + 1);

    if (this.minSpreadRate > 100) {
      this.minSpreadRate = 100;
    }
    if (this.maxSpreadRate > 100) {
      this.maxSpreadRate = 100;
    }

    this.position = position;
    this.population = {};
    this.population.default = this.generatePopulation();
    this.income = this.generateIncome();
    this.growthRate = this.generateGrowthRate();
    this.spreadRate = this.generateSpreadRate();
    this.upgrades = {};
    this.upgrades.income = 0;
    this.upgrades.growthRate = 0;
    this.upgrades.spreadRate = 0;
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

  generateSpreadRate() {
    return getRandomArbitrary(this.minSpreadRate, this.maxSpreadRate);
  }

  upgradeIncome(gameState) {
    var price = this.getIncomePrice();
    if (gameState.player.money >= price && this.population.player > 0) {
      gameState.player.money -= price;
      this.upgrades.income++;
      this.income = Math.floor((this.income * 110) / 100);
    }
  }

  upgradeGrowth(gameState) {
    var price = this.getGrowthPrice();
    if (gameState.player.money >= price && this.population.player > 0) {
      gameState.player.money -= price;
      this.upgrades.growthRate++;
      this.growthRate = Math.round(((this.growthRate * 110) / 100) * 100) / 100;
    }
  }

  upgradeSpread(gameState) {
    var price = this.getSpreadPrice();
    if (gameState.player.money >= price && this.population.player > 0) {
      gameState.player.money -= price;
      this.upgrades.spreadRate++;
      this.spreadRate = Math.round(((this.spreadRate * 110) / 100) * 100) / 100;
    }
  }

  getIncomePrice() {
    return this.getPrice(this.upgrades.income);
  }

  getGrowthPrice() {
    return this.getPrice(this.upgrades.growthRate);
  }

  getSpreadPrice() {
    return this.getPrice(this.upgrades.spreadRate);
  }

  getPrice(lvl) {
    return 1000000 * 2 ** lvl;
  }

  getPosition() {
    let xPos = this.position % 24;
    let yPos = Math.floor(this.position / 24);
    return [xPos * 50 + 25, yPos * 50 + 25];
  }
}
