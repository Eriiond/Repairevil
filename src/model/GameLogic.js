const virusFactor = 0.25; // How fast the virus growth on planets;

export class GameLogic {

    update(gameState) {
        updateMoney(gameState);
        updateShips(gameState);
        updateFights(gameState);
    }

    updateMoney(gameState) {
        for (let i = 0; i < gameState.universe.planets.length; i++) {
            const element = gameState.universe.planets[i];
            if (element.population.player > 0) {
                gameState.player.money += element.income;
            }
        }
    }

    updateShips(gameState) {
        for (let i = 0; i < gameState.universe.planets.length; i++) {
            const element = gameState.universe.planets[i];
            if (element.population.virus > 0) {
                element.population.virus += virusFactor * (gameState.level % 5 + 1);
            }
            if (element.population.player > 0) {
                gameState.player.money += element.income;
            }
        }
    }

    updateFights(gameState) {

    }
}