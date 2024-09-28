"use client";
import React, { useEffect, useState } from "react";
import { listOfSetFlashCard } from "@/dbTest/flashcard";
import WordCard from "@/components/flashcard/word_card";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/components/flashcard/flashcard";
import FlashcardSlider from "@/components/flashcard/flashcardSlider";
function loadFlashcardSet(id) {
  return listOfSetFlashCard.find((item) => {
    return item.id === id;
  });
}
function FCRan({ params }) {
  //id of set flashcard
  const id = params.id;
  const [flashcards, setFlashcards] = useState([]);
  const [setCard, setSetCard] = useState({});
  useEffect(() => {
    const set = loadFlashcardSet(id);
    if (set) {
      setFlashcards(set.flashcards);
      setSetCard({ ...set });
    }
  }, [id]);
  return (
    <div className="min-h-[100vh]">
      <div className="py-8 md:px-6">
        <div className="mx-auto max-w-3xl">
          <FlashcardSlider flashcards={flashcards}></FlashcardSlider>
        </div>
      </div>
    </div>
  );
}

export default FCRan;
