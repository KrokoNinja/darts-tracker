"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameState, Player } from "@/../types";
import { finishLeg, submitThrow } from "@/lib/game";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import FinishDialog from "@/components/FinishDialog";
import PlayerCard from "@/components/PlayerCard";
import ScoreInput from "@/components/ScoreInput";

export default function Local501Game() {
  const statLabels: Omit<
    Record<keyof Player["legStats"], string>,
    "throwsHistory"
  > = {
    remainingScore: "Remaining Score",
    score: "Score",
    throws: "Total Throws",
    threeDartAvg: "3-Dart Average",
    nineDartAvg: "First 9 Average",
    hundredPlus: "100+ Scores",
    eightyPlus: "80+ Scores",
    oneFortyPlus: "140+ Scores",
    oneEighty: "180s",
    doublesHit: "Doubles Hit",
    doubleThrows: "Doubles Throws",
  };

  const BOGEY_NUMBERS = [159, 162, 163, 165, 166, 168, 169];

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "Player 1",
      overallStats: {
        score: 0,
        throws: 0,
        threeDartAvg: 0,
        nineDartAvg: 0,
        hundredPlus: 0,
        eightyPlus: 0,
        oneFortyPlus: 0,
        oneEighty: 0,
        doublesHit: 0,
        doubleThrows: 0,
      },
      legStats: {
        remainingScore: 501,
        score: 0,
        throws: 0,
        throwsHistory: [],
        threeDartAvg: 0,
        nineDartAvg: 0,
        eightyPlus: 0,
        hundredPlus: 0,
        oneFortyPlus: 0,
        oneEighty: 0,
        doublesHit: 0,
        doubleThrows: 0,
      },
      legsWon: 0,
      setsWon: 0,
    },
    {
      id: 2,
      name: "Player 2",
      overallStats: {
        score: 0,
        throws: 0,
        threeDartAvg: 0,
        nineDartAvg: 0,
        hundredPlus: 0,
        eightyPlus: 0,
        oneFortyPlus: 0,
        oneEighty: 0,
        doublesHit: 0,
        doubleThrows: 0,
      },
      legStats: {
        remainingScore: 501,
        score: 0,
        throws: 0,
        throwsHistory: [],
        threeDartAvg: 0,
        nineDartAvg: 0,
        eightyPlus: 0,
        hundredPlus: 0,
        oneFortyPlus: 0,
        oneEighty: 0,
        doublesHit: 0,
        doubleThrows: 0,
      },
      legsWon: 0,
      setsWon: 0,
    },
  ]);
  const [gameState, setGameState] = useState<GameState>({
    players,
    currentPlayerIndex: 0,
    currentLeg: 1,
    currentSet: 1,
    bestOfLegs: 3,
    bestOfSets: 1,
    isLegFinished: false,
    isGameFinished: false,
  });

  const [inputScore, setInputScore] = useState("");
  const [score, setScore] = useState(0);

  const [darts, setDarts] = useState<number | null>(null);
  const [double, setDouble] = useState<number | null>(null);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const handleSubmitThrow = async (score: number) => {
    try {
      const isInFinishingArea =
        gameState.players[gameState.currentPlayerIndex].legStats
          .remainingScore < 170 &&
        !BOGEY_NUMBERS.includes(
          gameState.players[gameState.currentPlayerIndex].legStats
            .remainingScore
        );

      const newGameState = await submitThrow(gameState, score);
      if (newGameState.isLegFinished) {
        setGameState({ ...newGameState });
        setFinishDialogOpen(true);
      } else if (isInFinishingArea) {
        setFinishDialogOpen(true);
      } else {
        setGameState({ ...newGameState });
        setPlayers(newGameState.players);
        setInputScore(""); // Clear input after successful throw
        setDarts(null);
        setDouble(null);
      }
    } catch (error) {
      console.error("Error submitting throw:", error);
    }
  };

  const handleFinishLeg = async (darts: number, double: number) => {
    setDarts(darts);
    setDouble(double);
    setFinishDialogOpen(false);
    const newGameState = await finishLeg(gameState, score, darts, double);
    setGameState({ ...newGameState });
    setPlayers(newGameState.players);
    setInputScore("");
    setDarts(null);
    setDouble(null);
  };

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  return (
    <div>
      <FinishDialog
        open={finishDialogOpen}
        setOpen={setFinishDialogOpen}
        darts={darts}
        setDarts={setDarts}
        double={double}
        setDouble={setDouble}
        handleFinishLeg={handleFinishLeg}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {players.map((player: Player, index: number) => (
          <PlayerCard
            player={player}
            gameState={gameState}
            index={index}
            key={index}
          />
        ))}
      </div>
      <ScoreInput
        inputScore={inputScore}
        setInputScore={setInputScore}
        score={score}
        setScore={setScore}
        handleSubmitThrow={handleSubmitThrow}
        gameState={gameState}
      />
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stat</TableHead>
              <TableHead>Player 1</TableHead>
              <TableHead>Player 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Round Throws</TableCell>
              <TableCell>{players[0].legStats.throws}</TableCell>
              <TableCell>{players[1].legStats.throws}</TableCell>
            </TableRow>
            {Object.keys(players[0].legStats)
              .filter(
                (stat) =>
                  stat !== "throwsHistory" &&
                  stat !== "remainingScore" &&
                  stat !== "score" &&
                  stat !== "doublesHit" &&
                  stat !== "doubleThrows"
              )
              .map((stat) => (
                <TableRow key={stat}>
                  <TableCell>
                    {statLabels[stat as keyof typeof statLabels]}
                  </TableCell>
                  <TableCell>
                    {
                      players[0].overallStats[
                        stat as keyof Player["overallStats"]
                      ]
                    }
                  </TableCell>
                  <TableCell>
                    {
                      players[1].overallStats[
                        stat as keyof Player["overallStats"]
                      ]
                    }
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell>Doubles</TableCell>
              <TableCell>
                {players[0].overallStats.doublesHit}/
                {players[0].overallStats.doubleThrows} (
                {players[0].overallStats.doubleThrows === 0
                  ? "0.00"
                  : (
                      (players[0].overallStats.doublesHit /
                        players[0].overallStats.doubleThrows) *
                      100
                    ).toFixed(2)}
                %)
              </TableCell>
              <TableCell>
                {players[1].overallStats.doublesHit}/
                {players[1].overallStats.doubleThrows} (
                {players[1].overallStats.doubleThrows === 0
                  ? "0.00"
                  : (
                      (players[1].overallStats.doublesHit /
                        players[1].overallStats.doubleThrows) *
                      100
                    ).toFixed(2)}
                %)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
