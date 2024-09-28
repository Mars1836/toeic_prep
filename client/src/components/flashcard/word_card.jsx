"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2Icon } from "lucide-react";

export default function WordCard({ flashcard }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(flashcard.word);
      utterance.lang = "en-US";
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };
  if (!flashcard) {
    return <p>WordCard</p>;
  }
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-3xl font-bold">
              {flashcard.word}
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={speak}
              disabled={isPlaying}
              aria-label="Listen to pronunciation"
            >
              <Volume2Icon className={isPlaying ? "animate-pulse" : ""} />
            </Button>
          </div>
          <div className="flex gap-2">
            {flashcard.partOfSpeech ? (
              Array.isArray(flashcard.partOfSpeech) ? (
                flashcard.partOfSpeech.map((part, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {part}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className="text-sm">
                  {flashcard.partOfSpeech}
                </Badge>
              )
            ) : (
              <p></p>
            )}
          </div>
        </div>
        <div className="text-muted-foreground text-sm">
          {flashcard.pronunciation} • {flashcard.translation}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-1 font-semibold">Definition:</h3>
          <p>{flashcard.definition}</p>
        </div>
        <div>
          <h3 className="mb-1 font-semibold">Example Sentences:</h3>
          <ul className="list-disc space-y-1 pl-5">
            {flashcard.exampleSentence.map((sentence, index) => (
              <li key={index}>{sentence}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-1 font-semibold">Note:</h3>
          <p>{flashcard.note}</p>
        </div>
      </CardContent>
    </Card>
  );
}
