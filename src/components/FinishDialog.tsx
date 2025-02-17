"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Player } from "../../types";

export default function FinishDialog({
  open,
  setOpen,
  players,
  darts,
  setDarts,
  double,
  setDouble,
  handleFinishLeg,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  players: Player[];
  darts: number | null;
  setDarts: (darts: number) => void;
  double: number | null;
  setDouble: (double: number) => void;
  handleFinishLeg: (score: number, darts: number, double: number) => void;
}) {
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (page === 0) {
        if (["1", "2", "3"].includes(e.key)) {
          const dartCount = parseInt(e.key);
          setDarts(dartCount);
          setPage(1);
        }
      } else if (page === 1) {
        if (["1", "2", "3"].includes(e.key)) {
          setDouble(parseInt(e.key));
        }
      }

      if (
        e.key === "Enter" &&
        page === 1 &&
        darts !== null &&
        double !== null
      ) {
        handleFinishLeg(players[0].score, darts, double);
      } else if (e.key === "Enter" && page === 0 && darts !== null) {
        setPage(1);
      }

      if (e.key === "Backspace" && page === 1) {
        setPage(0);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [page, darts, double]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Great Finish!</DialogTitle>
        </DialogHeader>
        {page === 0 && (
          <div>
            <p>How many darts did it take?</p>
            <div className="flex flex-row">
              <Input
                type="radio"
                id="1-dart"
                name="darts"
                checked={darts === 1}
                onChange={() => {
                  setDarts(1);
                  setPage(1);
                }}
              />
              <Label className="text-sm" htmlFor="1-dart">
                1 Dart
              </Label>
            </div>
            <div className="flex flex-row">
              <Input
                type="radio"
                id="2-darts"
                name="darts"
                checked={darts === 2}
                onChange={() => {
                  setDarts(2);
                  setPage(1);
                }}
              />
              <Label className="text-sm" htmlFor="2-darts">
                2 Darts
              </Label>
            </div>
            <div className="flex flex-row">
              <Input
                type="radio"
                id="3-darts"
                name="darts"
                checked={darts === 3}
                onChange={() => {
                  setDarts(3);
                  setPage(1);
                }}
              />
              <Label className="text-sm" htmlFor="3-darts">
                3 Darts
              </Label>
            </div>
          </div>
        )}
        {page === 1 && (
          <div>
            <p>How many darts did you throw on a double?</p>
            <div className="flex flex-row">
              <Input
                type="radio"
                id="1-dart"
                name="double"
                checked={double === 1}
                onChange={() => setDouble(1)}
              />
              <Label className="text-sm" htmlFor="1-dart">
                1 Dart
              </Label>
            </div>
            {darts && darts > 1 && (
              <div className="flex flex-row">
                <Input
                  type="radio"
                  id="2-darts"
                  name="double"
                  checked={double === 2}
                  onChange={() => setDouble(2)}
                />
                <Label className="text-sm" htmlFor="2-darts">
                  2 Darts
                </Label>
              </div>
            )}
            {darts && darts > 2 && (
              <div className="flex flex-row">
                <Input
                  type="radio"
                  id="3-darts"
                  name="double"
                  checked={double === 3}
                  onChange={() => setDouble(3)}
                />
                <Label className="text-sm" htmlFor="3-darts">
                  3 Darts
                </Label>
              </div>
            )}
          </div>
        )}
        {page == 0 && <Button onClick={() => setPage(1)}>Next</Button>}
        {page == 1 && (
          <div className="flex justify-between">
            <Button
              onClick={() => setPage(0)}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  setPage(0);
                }
              }}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (darts !== null && double !== null) {
                  handleFinishLeg(players[0].score, darts, double);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && darts !== null && double !== null) {
                  handleFinishLeg(players[0].score, darts, double);
                }
              }}
            >
              Submit
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
