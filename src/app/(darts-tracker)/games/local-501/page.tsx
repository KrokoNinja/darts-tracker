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

export default function Local501Game() {
  const statLabels: Record<keyof Player["stats"], string> = {
    threeDartAvg: "3-Dart Average",
    nineDartAvg: "9-Dart Average",
    hundredPlus: "100+ Scores",
    eightyFivePlus: "85+ Scores",
    oneFortyPlus: "140+ Scores",
    oneEighty: "180s",
  };

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "Player 1",
      score: 501,
      totalThrows: 0,
      throwsHistory: [],
      doublesHit: 0,
      doubleThrows: 0,
      stats: {
        threeDartAvg: 0,
        nineDartAvg: 0,
        hundredPlus: 0,
        eightyFivePlus: 0,
        oneFortyPlus: 0,
        oneEighty: 0,
      },
      legsWon: 0,
    },
    {
      id: 2,
      name: "Player 2",
      score: 501,
      totalThrows: 0,
      throwsHistory: [],
      doublesHit: 0,
      doubleThrows: 0,
      stats: {
        threeDartAvg: 0,
        nineDartAvg: 0,
        hundredPlus: 0,
        eightyFivePlus: 0,
        oneFortyPlus: 0,
        oneEighty: 0,
      },
      legsWon: 0,
    },
  ]);
  const [gameState, setGameState] = useState<GameState>({
    players,
    currentPlayerIndex: 0,
    currentLeg: 1,
    currentSet: 1,
    bestOfLegs: 1,
    bestOfSets: 1,
    isLegFinished: false,
    isGameFinished: false,
  });

  const [inputScore, setInputScore] = useState("");

  const [darts, setDarts] = useState<number | null>(null);
  const [double, setDouble] = useState<number | null>(null);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const handleSubmitThrow = async (score: number) => {
    try {
      const newGameState = await submitThrow(gameState, score);
      setGameState({ ...newGameState });
      setPlayers(newGameState.players);
      setInputScore(""); // Clear input after successful throw
      if (newGameState.isLegFinished) {
        setFinishDialogOpen(true);
      }
    } catch (error) {
      console.error("Error submitting throw:", error);
    }
  };

  const handleFinishLeg = async (
    score: number,
    darts: number,
    double: number
  ) => {
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
    <div className="p-4">
      <FinishDialog
        open={finishDialogOpen}
        setOpen={setFinishDialogOpen}
        players={players}
        darts={darts}
        setDarts={setDarts}
        double={double}
        setDouble={setDouble}
        handleFinishLeg={handleFinishLeg}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {players.map((player, index) => (
          <Card
            key={index}
            className={`border-2 ${
              gameState.currentPlayerIndex === index
                ? "border-green-500"
                : "border-gray-700"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{player.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-4">{player.score}</div>
              <div className="text-xl mb-2">
                Average: {player.stats.threeDartAvg}
              </div>
              <div className="text-xl">
                Last Score:{" "}
                {player.throwsHistory.length > 0
                  ? player.throwsHistory[player.throwsHistory.length - 1]
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl mb-4">Enter Score</h2>
        <div className="flex gap-4 mb-4">
          <Input
            type="number"
            value={inputScore}
            onChange={(e) => setInputScore(e.target.value)}
            placeholder="Enter score (0-180)"
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputScore) {
                handleSubmitThrow(Number(inputScore));
              } else if (e.key === "Enter" && !inputScore) {
                handleSubmitThrow(0);
              }
            }}
            disabled={gameState.isGameFinished}
          />
          <Button onClick={() => handleSubmitThrow(Number(inputScore))}>
            Submit
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[26, 41, 45, 60, 81, 85, 100, 120, 140].map((score) => (
            <Button
              key={score}
              onClick={() => handleSubmitThrow(score)}
              variant="outline"
              disabled={gameState.isGameFinished}
            >
              {score}
            </Button>
          ))}
        </div>
      </div>
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
              <TableCell>Total Throws</TableCell>
              <TableCell>{players[0].totalThrows}</TableCell>
              <TableCell>{players[1].totalThrows}</TableCell>
            </TableRow>
            {Object.keys(players[0].stats).map((stat) => (
              <TableRow key={stat}>
                <TableCell>
                  {statLabels[stat as keyof Player["stats"]]}
                </TableCell>
                <TableCell>
                  {players[0].stats[stat as keyof Player["stats"]]}
                </TableCell>
                <TableCell>
                  {players[1].stats[stat as keyof Player["stats"]]}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Doubles</TableCell>
              <TableCell>
                {players[0].doublesHit}/{players[0].doubleThrows} (
                {players[0].doubleThrows === 0
                  ? "0.00"
                  : (
                      (players[0].doublesHit / players[0].doubleThrows) *
                      100
                    ).toFixed(2)}
                %)
              </TableCell>
              <TableCell>
                {players[1].doublesHit}/{players[1].doubleThrows} (
                {players[1].doubleThrows === 0
                  ? "0.00"
                  : (
                      (players[1].doublesHit / players[1].doubleThrows) *
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
