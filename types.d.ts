export interface Player {
  id: number;
  name: string;
  score: number;
  totalThrows: number;
  throwsHistory: number[];
  doublesHit: number;
  doubleThrows: number;
  stats: {
    threeDartAvg: number;
    nineDartAvg: number;
    hundredPlus: number;
    eightyFivePlus: number;
    oneFortyPlus: number;
    oneEighty: number;
  };
  legsWon: number;
}
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentLeg: number;
  currentSet: number;
  bestOfLegs: number;
  bestOfSets: number;
  isLegFinished: boolean;
  isGameFinished: boolean;
}
