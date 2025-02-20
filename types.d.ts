export interface Player {
  id: number;
  name: string;
  overallStats: {
    score: number;
    throws: number;
    threeDartAvg: number;
    nineDartAvg: number;
    hundredPlus: number;
    eightyPlus: number;
    oneFortyPlus: number;
    oneEighty: number;
    doublesHit: number;
    doubleThrows: number;
  };
  legStats: {
    remainingScore: number;
    score: number;
    throws: number;
    throwsHistory: number[];
    threeDartAvg: number;
    nineDartAvg: number;
    hundredPlus: number;
    eightyPlus: number;
    oneFortyPlus: number;
    oneEighty: number;
    doublesHit: number;
    doubleThrows: number;
  };
  legsWon: number;
  setsWon: number;
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
