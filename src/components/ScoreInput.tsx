import { GameState } from "../../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ScoreInput({
  inputScore,
  setInputScore,
  score,
  setScore,
  handleSubmitThrow,
  gameState,
}: {
  inputScore: string;
  setInputScore: (inputScore: string) => void;
  score: number;
  setScore: (score: number) => void;
  handleSubmitThrow: (score: number) => void;
  gameState: GameState;
}) {
  return (
    <div className="mt-4">
      <h2 className="text-2xl mb-4">Enter Score</h2>
      <div className="flex gap-4 mb-4">
        <Input
          type="number"
          value={inputScore}
          onChange={(e) => {
            setInputScore(e.target.value);
            setScore(Number(e.target.value));
          }}
          placeholder="Enter score (0-180)"
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputScore) {
              handleSubmitThrow(score);
            } else if (e.key === "Enter" && !inputScore) {
              handleSubmitThrow(0);
            }
          }}
          disabled={gameState.isGameFinished}
        />
        <Button onClick={() => handleSubmitThrow(score)}>Submit</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[26, 41, 45, 60, 81, 85, 100, 120, 140].map((score) => (
          <Button
            key={score}
            onClick={() => {
              setScore(score);
              handleSubmitThrow(score);
            }}
            variant="outline"
            disabled={gameState.isGameFinished}
          >
            {score}
          </Button>
        ))}
      </div>
    </div>
  );
}
