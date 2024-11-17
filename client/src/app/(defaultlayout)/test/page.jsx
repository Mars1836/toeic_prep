"use client";
import { useEffect } from "react";
import { FlashcardLearningComponent } from "../../../components/flashcard-learning";

export default function TestPage() {
  useEffect(() => {
    console.log("TestPage");
  }, []);
  return <FlashcardLearningComponent />;
}
