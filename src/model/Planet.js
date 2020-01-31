const base_minPopulation = 100;
const base_maxPopulation = 1000;
const base_minIncome = 1000000;
const base_maxIncome = 2500000;
const base_minGrowthRate = 1;
const base_maxGrowthRate = 10;
const base_minSpreadRate = 1;
const base_maxSpreadRate = 20;

export class Planet {
  // position: Number;
  // population: {virus: Number, player: Number, default: Number}
  // income: Number
  // growthRate: Number
  // spreadRate: Number
  // upgrades: {income: Number, growthRate: Number, spreadRate: Number }

  constructor(position, level) {
    this.minPopulation = base_minPopulation * (level % 5 + 1);
    this.maxPopulation = base_maxPopulation * (level % 5 + 1);
    this.minIncome = base_minIncome * (level % 5 + 1);
    this.maxIncome = base_maxIncome * (level % 5 + 1);
    this.minGrowthRate = base_minGrowthRate * (level % 5 + 1);
    this.maxGrowthRate = base_maxGrowthRate * (level % 5 + 1);
    this.minSpreadRate = base_minSpreadRate * (level % 5 + 1);
    this.maxSpreadRate = base_maxSpreadRate * (level % 5 + 1);

    this.position = position;
    this.population.default = generatePopulation();
    this.income = generateIncome();
    this.growthRate = generateGrowthRate();
    this.spreadRate = generateSpreadRate();
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
}
