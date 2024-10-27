"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";

export function Flashcard({ flashcard, isHide = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFront, setIsFront] = useState(false);
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  useEffect(() => {
    setTimeout(() => {
      setIsFront(isFlipped);
    }, 150);
  }, [isFlipped]);
  useEffect(() => {
    if (isHide) {
      setIsFlipped(false);
    }
  }, [isHide]);
  if (!flashcard) {
    return <div></div>;
  }

  return (
    <Card className="perspective-1000 min-h-80 w-full min-w-96 flex-shrink-0">
      <CardContent
        className="transform-style-preserve-3d relative h-96 w-full cursor-pointer transition-transform duration-500"
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        onClick={flipCard}
      >
        {!isFront ? (
          <div className="backface-hidden absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-center text-3xl font-bold">{flashcard.word}</h2>
            <p className="mt-2 text-sm text-gray-500">
              Click to reveal definition
            </p>
          </div>
        ) : (
          <div
            className="w-fullbackface-hidden absolute inset-0 flex h-full items-center justify-center rounded-lg bg-white p-6 shadow-lg"
            style={{ transform: "rotateY(180deg)" }}
          >
            <p className="text-center text-lg">{flashcard.definition}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
