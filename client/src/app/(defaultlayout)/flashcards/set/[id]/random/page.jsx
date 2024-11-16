"use client";
import React, { useEffect, useState } from "react";
import { listOfSetFlashCard } from "@/dbTest/flashcard";
import WordCard from "@/components/flashcard/word_card";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/components/flashcard/flashcard";
import FlashcardSlider from "@/components/flashcard/flashcardSlider";
import instance from "~configs/axios.instance";
import { endpoint } from "~consts";

function FCRan({ params }) {
  const id = params.id;
  const [flashcards, setFlashcards] = useState([]);
  const [setCard, setSetCard] = useState({});
  useEffect(() => {
    async function fetchFlashcards() {
      const { data } = await instance.get(endpoint.flashcardItem.getBySet, {
        params: {
          setFlashcardId: id,
        },
      });
      setFlashcards(data);
    }
    fetchFlashcards();
  }, []);
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
