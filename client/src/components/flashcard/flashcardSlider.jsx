"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Flashcard } from "./flashcard";

export default function FlashcardSlider({ flashcards }) {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };
  useEffect(() => {}, []);
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentCard * 100}%)` }}
        >
          {flashcards.map((flashcard, index) => {
            return (
              <Flashcard
                flashcard={flashcard}
                isHide={currentCard !== index}
              ></Flashcard>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Button
          onClick={prevCard}
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Previous card</span>
        </Button>
        <Button
          onClick={nextCard}
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
        >
          <ChevronRightIcon className="h-4 w-4" />
          <span className="sr-only">Next card</span>
        </Button>
      </div>
    </div>
  );
}
