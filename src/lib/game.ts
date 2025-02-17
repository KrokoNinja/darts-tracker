"use server";

import type { GameState, Player } from "../../types";

const resetPlayer = (player: Player) => {
  player.score = 501;
  player.totalThrows = 0;
  player.throwsHistory = [];
  player.doublesHit = player.doublesHit;
  player.doubleThrows = player.doubleThrows;
  player.stats = {
    threeDartAvg: player.stats.threeDartAvg,
    nineDartAvg: player.stats.nineDartAvg,
    hundredPlus: player.stats.hundredPlus,
    eightyFivePlus: player.stats.eightyFivePlus,
    oneFortyPlus: player.stats.oneFortyPlus,
    oneEighty: player.stats.oneEighty,
  };
};

export async function submitThrow(gameState: GameState, roundTotal: number) {
  let newGameState = JSON.parse(JSON.stringify(gameState));
  let currentPlayer = newGameState.players[newGameState.currentPlayerIndex];

  if (currentPlayer.score - roundTotal < 0) {
    currentPlayer.totalThrows += 3;
    currentPlayer.throwsHistory.push(0);
    currentPlayer.stats.threeDartAvg = (
      (501 - currentPlayer.score) /
      (currentPlayer.totalThrows / 3)
    ).toFixed(2);
    if (currentPlayer.totalThrows <= 9) {
      currentPlayer.stats.nineDartAvg = (
        (501 - currentPlayer.score) /
        (currentPlayer.totalThrows / 3)
      ).toFixed(2);
    }
    newGameState.currentPlayerIndex = (newGameState.currentPlayerIndex + 1) % 2;
    return newGameState;
  }

  currentPlayer.totalThrows += 3;
  currentPlayer.throwsHistory.push(roundTotal);
  currentPlayer.score -= roundTotal;

  // Statistics tracking
  currentPlayer.stats.threeDartAvg = (
    (501 - currentPlayer.score) /
    (currentPlayer.totalThrows / 3)
  ).toFixed(2);
  if (currentPlayer.totalThrows <= 9) {
    currentPlayer.stats.nineDartAvg = (
      (501 - currentPlayer.score) /
      (currentPlayer.totalThrows / 3)
    ).toFixed(2);
  }
  if (roundTotal >= 100 && roundTotal < 140) currentPlayer.stats.hundredPlus++;
  if (roundTotal >= 85 && roundTotal < 100)
    currentPlayer.stats.eightyFivePlus++;
  if (roundTotal >= 140 && roundTotal < 180) currentPlayer.stats.oneFortyPlus++;
  if (roundTotal === 180) currentPlayer.stats.oneEighty++;

  if (currentPlayer.score === 0) {
    newGameState.isLegFinished = true;
  } else {
    newGameState.currentPlayerIndex = (newGameState.currentPlayerIndex + 1) % 2;
  }
  return newGameState;
}

export async function finishLeg(
  gameState: GameState,
  score: number,
  darts: number,
  double: number
) {
  let newGameState = JSON.parse(JSON.stringify(gameState));
  newGameState.players[gameState.currentPlayerIndex].legsWon++;
  newGameState.isLegFinished = true;
  if (
    newGameState.players[gameState.currentPlayerIndex].legsWon >
    gameState.bestOfLegs / 2
  ) {
    newGameState.isGameFinished = true;
    newGameState.players[gameState.currentPlayerIndex].doublesHit += double;
    newGameState.players[gameState.currentPlayerIndex].doubleThrows += darts;
    newGameState.players[gameState.currentPlayerIndex].score -= score;
    newGameState.players[gameState.currentPlayerIndex].throwsHistory.push(
      score
    );
    newGameState.players[gameState.currentPlayerIndex].totalThrows += darts;
    newGameState.players[gameState.currentPlayerIndex].stats.threeDartAvg = (
      (501 - newGameState.players[gameState.currentPlayerIndex].score) /
      (newGameState.players[gameState.currentPlayerIndex].totalThrows / 3)
    ).toFixed(2);
    if (newGameState.players[gameState.currentPlayerIndex].totalThrows <= 9) {
      newGameState.players[gameState.currentPlayerIndex].stats.nineDartAvg = (
        (501 - newGameState.players[gameState.currentPlayerIndex].score) /
        (newGameState.players[gameState.currentPlayerIndex].totalThrows / 3)
      ).toFixed(2);
    }
  } else {
    newGameState.currentLeg++;
    resetPlayer(newGameState.players[gameState.currentPlayerIndex]);
    resetPlayer(
      newGameState.players[gameState.currentPlayerIndex === 0 ? 1 : 0]
    );
  }
  return newGameState;
}
