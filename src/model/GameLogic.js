const virusFactor = 0.25; // How fast the virus growth on planets;
let counter = 0;
export class GameLogic {
  static update(gameState) {
    if (counter % 30 == 0) {
      counter = counter + 1;
      GameLogic.updateMoney(gameState);
      GameLogic.updateShips(gameState);
      GameLogic.updateFights(gameState);
    }
  }

  static updateMoney(gameState) {
    for (let i = 0; i < gameState.universe.planets.length; i++) {
      const element = gameState.universe.planets[i];
      if (element.population.player > 0) {
        gameState.player.money += element.income;
      }
    }
  }

  static updateShips(gameState) {
    for (let i = 0; i < gameState.universe.planets.length; i++) {
      const element = gameState.universe.planets[i];
      if (element.population.virus > 0) {
        element.population.virus += virusFactor * ((gameState.level % 5) + 1);
      }
      if (element.population.player > 0) {
        gameState.player.money += element.income;
      }
    }
  }

  static updateFights(gameState) {}
}
