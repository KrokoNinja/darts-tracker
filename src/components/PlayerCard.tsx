import { GameState, Player } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function PlayerCard({
  player,
  gameState,
  index,
}: {
  player: Player;
  gameState: GameState;
  index: number;
}) {
  return (
    <Card
      key={index}
      className={`border-2 ${
        gameState.currentPlayerIndex === index
          ? "border-green-500"
          : "border-gray-700"
      }`}
    >
      <CardHeader>
        <CardTitle className="text-2xl">
          <div className="flex justify-between">
            <div>{player.name}</div>
            <div>Legs: {player.legsWon}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold mb-4">
          {player.legStats.remainingScore}
        </div>
        <div className="flex justify-between text-xl mb-2">
          <p>Average: {player.overallStats.threeDartAvg}</p>
          <p>Leg Average: {player.legStats.threeDartAvg}</p>
        </div>
        <div className="text-xl">
          Last Score:{" "}
          {player.legStats.throwsHistory.length > 0
            ? player.legStats.throwsHistory[
                player.legStats.throwsHistory.length - 1
              ]
            : "N/A"}
          <div className="text-sm text-gray-500">
            (
            {player.legStats.throwsHistory.length > 0 &&
              player.legStats.throwsHistory.map((score, index) => (
                <span key={index}>
                  {score}
                  {index < player.legStats.throwsHistory.length - 1 && ","}
                </span>
              ))}
            )
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
