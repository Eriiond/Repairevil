export const GamePhaseChooseBase = "GamePhaseChooseBase";
export const GamePhaseIngame = "GamePhaseIngame";
export const GamePhaseEnd = "GamePhaseEnd";

export class GameState {
  constructor(universe, player, level) {
    this.universe = universe;
    this.player = player;
    this.level = level;
    this.gamePhase = GamePhaseChooseBase;
  }
}
