"use client";
import React, { useEffect, useState } from "react";
import FlashcardSlider from "@/components/flashcard/flashcardSlider";
import instance from "~configs/axios.instance";
import { endpoint } from "~consts";

function FCRan({ params }) {
  const id = params.id;
  const [flashcards, setFlashcards] = useState([]);
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
