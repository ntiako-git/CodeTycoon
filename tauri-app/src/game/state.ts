type GameState = {
  money: number;
  reputation: number;
  currentContract: string | null;
  unlockedContracts: string[];
}

export const gameState: GameState = {
  money: 0,
  reputation: 0,
  currentContract: null,
  unlockedContracts: []
}
