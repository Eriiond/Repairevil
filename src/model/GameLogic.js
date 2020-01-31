export class GameLogic {

    update(gameState) {
        updateMoney();
        updateShips();
        updateFights();
    }

    updateMoney() {
        for (let i = 0; i < gameState.universe.planets.length; i++) {
            const element = gameState.universe.planets[i];

        }
    }

    updateShips() {

    }

    updateFights() {

    }
}