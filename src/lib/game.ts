"use server";

import type { GameState, Player } from "../../types";

const BOGEY_NUMBERS = [159, 162, 163, 165, 166, 168, 169];

const resetPlayer = (player: Player) => {
  player.legStats = {
    remainingScore: 501,
    score: 0,
    throws: 0,
    throwsHistory: [],
    threeDartAvg: 0,
    nineDartAvg: 0,
    hundredPlus: 0,
    eightyPlus: 0,
    oneFortyPlus: 0,
    oneEighty: 0,
    doublesHit: 0,
    doubleThrows: 0,
  };
};

export async function submitThrow(gameState: GameState, roundTotal: number) {
  let newGameState = JSON.parse(JSON.stringify(gameState));
  let currentPlayer = newGameState.players[newGameState.currentPlayerIndex];

  if (currentPlayer.legStats.remainingScore - roundTotal < 0) {
    currentPlayer.legStats.throws += 3;
    currentPlayer.overallStats.throws += 3;
    currentPlayer.legStats.throwsHistory.push(0);
    currentPlayer.legStats.threeDartAvg = (
      (currentPlayer.legStats.score / currentPlayer.legStats.throws) *
      3
    ).toFixed(2);
    currentPlayer.overallStats.threeDartAvg = (
      (currentPlayer.overallStats.score / currentPlayer.overallStats.throws) *
      3
    ).toFixed(2);
    //TODO: Fix overall 9 Dart Average
    if (currentPlayer.legStats.throws <= 9) {
      currentPlayer.legStats.nineDartAvg = (
        (currentPlayer.legStats.score / currentPlayer.legStats.throws) *
        3
      ).toFixed(2);
    }
    newGameState.currentPlayerIndex = (newGameState.currentPlayerIndex + 1) % 2;
    return newGameState;
  }

  if (currentPlayer.legStats.remainingScore - roundTotal === 0) {
    newGameState.isLegFinished = true;
    return newGameState;
  } else if (
    newGameState.players[newGameState.currentPlayerIndex].legStats
      .remainingScore > 0 &&
    newGameState.players[newGameState.currentPlayerIndex].legStats
      .remainingScore < 50 &&
    !BOGEY_NUMBERS.includes(
      newGameState.players[newGameState.currentPlayerIndex].legStats
        .remainingScore + roundTotal
    ) &&
    newGameState.players[newGameState.currentPlayerIndex].legStats
      .remainingScore +
      roundTotal <=
      170
  ) {
    return newGameState;
  } else {
    newGameState.currentPlayerIndex = (newGameState.currentPlayerIndex + 1) % 2;
  }

  currentPlayer.legStats.throws += 3;
  currentPlayer.overallStats.throws += 3;
  currentPlayer.legStats.throwsHistory.push(roundTotal);
  currentPlayer.legStats.score += roundTotal;
  currentPlayer.overallStats.score += roundTotal;
  currentPlayer.legStats.remainingScore -= roundTotal;
  // Statistics tracking
  currentPlayer.legStats.threeDartAvg = (
    (currentPlayer.legStats.score / currentPlayer.legStats.throws) *
    3
  ).toFixed(2);
  currentPlayer.overallStats.threeDartAvg = (
    (currentPlayer.overallStats.score / currentPlayer.overallStats.throws) *
    3
  ).toFixed(2);
  if (currentPlayer.legStats.throws <= 9) {
    //TODO: Fix overall 9 Dart Average
    currentPlayer.legStats.nineDartAvg = (
      (currentPlayer.legStats.score / currentPlayer.legStats.throws) *
      3
    ).toFixed(2);
  }
  if (roundTotal >= 100 && roundTotal < 140) {
    currentPlayer.legStats.hundredPlus++;
    currentPlayer.overallStats.hundredPlus++;
  }
  if (roundTotal >= 80 && roundTotal < 100) {
    currentPlayer.legStats.eightyPlus++;
    currentPlayer.overallStats.eightyPlus++;
  }
  if (roundTotal >= 140 && roundTotal < 180) {
    currentPlayer.legStats.oneFortyPlus++;
    currentPlayer.overallStats.oneFortyPlus++;
  }
  if (roundTotal === 180) {
    currentPlayer.legStats.oneEighty++;
    currentPlayer.overallStats.oneEighty++;
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
  if (gameState.isLegFinished) {
    newGameState.players[gameState.currentPlayerIndex].legsWon++;
    if (
      newGameState.players[gameState.currentPlayerIndex].legsWon >
      gameState.bestOfLegs / 2
    ) {
      newGameState.isGameFinished = true;
      newGameState.players[gameState.currentPlayerIndex].legStats.doublesHit++;
      newGameState.players[gameState.currentPlayerIndex].overallStats
        .doublesHit++;
      newGameState.players[
        gameState.currentPlayerIndex
      ].legStats.doubleThrows += double;
      newGameState.players[
        gameState.currentPlayerIndex
      ].overallStats.doubleThrows += double;
      newGameState.players[gameState.currentPlayerIndex].legStats.score +=
        score;
      newGameState.players[gameState.currentPlayerIndex].overallStats.score +=
        score;
      newGameState.players[
        gameState.currentPlayerIndex
      ].legStats.throwsHistory.push(score);
      newGameState.players[gameState.currentPlayerIndex].legStats.totalThrows +=
        darts;
      newGameState.players[
        gameState.currentPlayerIndex
      ].overallStats.totalThrows += darts;
      newGameState.players[gameState.currentPlayerIndex].legStats.threeDartAvg =
        (
          (newGameState.players[gameState.currentPlayerIndex].legStats.score /
            newGameState.players[gameState.currentPlayerIndex].legStats
              .throws) *
          3
        ).toFixed(2);
      newGameState.players[
        gameState.currentPlayerIndex
      ].overallStats.threeDartAvg = (
        (newGameState.players[gameState.currentPlayerIndex].overallStats.score /
          newGameState.players[gameState.currentPlayerIndex].overallStats
            .throws) *
        3
      ).toFixed(2);
      //TODO: Fix overall 9 Dart Average
      if (
        newGameState.players[gameState.currentPlayerIndex].legStats.throws <= 9
      ) {
        newGameState.players[
          gameState.currentPlayerIndex
        ].legStats.nineDartAvg = (
          (newGameState.players[gameState.currentPlayerIndex].legStats.score /
            newGameState.players[gameState.currentPlayerIndex].legStats
              .throws) *
          3
        ).toFixed(2);
      }
    } else {
      newGameState.players[gameState.currentPlayerIndex].legStats.doublesHit++;
      newGameState.players[gameState.currentPlayerIndex].overallStats
        .doublesHit++;
      newGameState.players[
        gameState.currentPlayerIndex
      ].legStats.doubleThrows += double;
      newGameState.players[
        gameState.currentPlayerIndex
      ].overallStats.doubleThrows += double;
      newGameState.players[gameState.currentPlayerIndex].legStats.score +=
        score;
      newGameState.players[gameState.currentPlayerIndex].overallStats.score +=
        score;
      newGameState.players[gameState.currentPlayerIndex].legStats.throws +=
        darts;
      newGameState.players[gameState.currentPlayerIndex].overallStats.throws +=
        darts;
      newGameState.players[gameState.currentPlayerIndex].legStats.threeDartAvg =
        (
          (newGameState.players[gameState.currentPlayerIndex].legStats.score /
            newGameState.players[gameState.currentPlayerIndex].legStats
              .throws) *
          3
        ).toFixed(2);
      newGameState.players[
        gameState.currentPlayerIndex
      ].overallStats.threeDartAvg = (
        (newGameState.players[gameState.currentPlayerIndex].overallStats.score /
          newGameState.players[gameState.currentPlayerIndex].overallStats
            .throws) *
        3
      ).toFixed(2);
      //TODO: Fix overall 9 Dart Average
      if (
        newGameState.players[gameState.currentPlayerIndex].legStats.throws <= 9
      ) {
        newGameState.players[
          gameState.currentPlayerIndex
        ].legStats.nineDartAvg = (
          (newGameState.players[gameState.currentPlayerIndex].legStats.score /
            newGameState.players[gameState.currentPlayerIndex].legStats
              .throws) *
          3
        ).toFixed(2);
      }
      newGameState.currentLeg++;
      newGameState.isLegFinished = false;
      resetPlayer(newGameState.players[gameState.currentPlayerIndex]);
      resetPlayer(
        newGameState.players[gameState.currentPlayerIndex === 0 ? 1 : 0]
      );
    }
    return newGameState;
  } else {
    newGameState.players[gameState.currentPlayerIndex].legStats.score += score;
    newGameState.players[gameState.currentPlayerIndex].overallStats.score +=
      score;
    newGameState.players[
      gameState.currentPlayerIndex
    ].legStats.remainingScore -= score;
    newGameState.players[
      gameState.currentPlayerIndex
    ].legStats.throwsHistory.push(score);
    newGameState.players[gameState.currentPlayerIndex].legStats.totalThrows +=
      darts;
    newGameState.players[
      gameState.currentPlayerIndex
    ].overallStats.totalThrows += darts;
    newGameState.players[gameState.currentPlayerIndex].legStats.doubleThrows +=
      double;
    newGameState.players[
      gameState.currentPlayerIndex
    ].overallStats.doubleThrows += double;
    newGameState.players[gameState.currentPlayerIndex].legStats.threeDartAvg = (
      (newGameState.players[gameState.currentPlayerIndex].legStats.score /
        newGameState.players[gameState.currentPlayerIndex].legStats.throws) *
      3
    ).toFixed(2);
    newGameState.players[
      gameState.currentPlayerIndex
    ].overallStats.threeDartAvg = (
      (newGameState.players[gameState.currentPlayerIndex].overallStats.score /
        newGameState.players[gameState.currentPlayerIndex].overallStats
          .throws) *
      3
    ).toFixed(2);
    //TODO: Fix overall 9 Dart Average
    if (
      newGameState.players[gameState.currentPlayerIndex].legStats.throws <= 9
    ) {
      newGameState.players[gameState.currentPlayerIndex].legStats.nineDartAvg =
        (
          (newGameState.players[gameState.currentPlayerIndex].legStats.score /
            newGameState.players[gameState.currentPlayerIndex].legStats
              .throws) *
          3
        ).toFixed(2);
    }
    newGameState.currentPlayerIndex = (newGameState.currentPlayerIndex + 1) % 2;
    return newGameState;
  }
}
