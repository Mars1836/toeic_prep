"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Volume2Icon } from "lucide-react";
import { calculateDecay } from "~helper";
import { RATE_LIMIT } from "~consts";

const getScoreColor = (decayScore) => {
  if (decayScore >= 0.8) return "bg-green-500";
  if (decayScore >= 0.5) return "bg-yellow-500";
  return "bg-red-500";
};

const getCoefficientColor = (retentionScore) => {
  if (retentionScore >= 4) return "bg-blue-500";
  if (retentionScore >= 3) return "bg-yellow-500";
  if (retentionScore >= 1) return "bg-orange-500";
  return "bg-red-500";
};
function getDiffDays(optimalTime) {
  return (
    (new Date(optimalTime).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24)
  ).toFixed(2);
}
const statusColors = {
  needLearn1: "border-red-500",
  needLearn2: "border-yellow-500",
  needLearn3: "border-green-500",
};
function getStatus(rateDiffDays) {
  if (rateDiffDays === RATE_LIMIT) {
    return statusColors.needLearn2;
  }
  if (rateDiffDays < RATE_LIMIT) {
    return statusColors.needLearn1;
  }

  return statusColors.needLearn3;
}
export default function TrackingWordCard({ learningFlashcard }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [decayScore, setDecayScore] = useState(0);
  const [status, setStatus] = useState(
    getStatus(learningFlashcard.rateDiffDays)
  );
  function handleDecayScore(studyTime) {
    const diffDays = (
      (-new Date(studyTime).getTime() + new Date().getTime()) /
      (1000 * 60 * 60 * 24)
    ).toFixed(2);
    setDecayScore(calculateDecay(learningFlashcard.decayScore, diffDays));
  }

  const speak = () => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(
        learningFlashcard.flashcardId.word
      );
      utterance.lang = "en-US";
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };
  if (!learningFlashcard) {
    return <p>WordCard</p>;
  }
  useEffect(() => {
    handleDecayScore(learningFlashcard.lastStudied);
    const interval = setInterval(() => {
      handleDecayScore(learningFlashcard.lastStudied);
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [learningFlashcard]);
  return (
    learningFlashcard && (
      <Card className={`w-full relative ${status} border-l-4`}>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-3xl font-bold">
                {learningFlashcard.flashcardId.word}
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
            <div className="flex gap-2 items-center">
              {learningFlashcard.flashcardId.partOfSpeech ? (
                Array.isArray(learningFlashcard.flashcardId.partOfSpeech) ? (
                  learningFlashcard.flashcardId.partOfSpeech.map(
                    (part, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {part}
                      </Badge>
                    )
                  )
                ) : (
                  <Badge variant="secondary" className="text-sm">
                    {learningFlashcard.flashcardId.partOfSpeech}
                  </Badge>
                )
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className="text-muted-foreground text-sm">
            {learningFlashcard.flashcardId.pronunciation}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <h3 className="mb-1 font-semibold">Translate:</h3>
            <p className="font-semibold">
              {learningFlashcard.flashcardId.translation}
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Definition:</h3>
            <p>{learningFlashcard.flashcardId.definition}</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Example Sentences:</h3>
            <ul className="list-disc space-y-1 pl-5">
              {learningFlashcard.flashcardId.exampleSentence?.map(
                (sentence, index) => (
                  <li key={index}>{sentence}</li>
                )
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Note:</h3>
            <p>{learningFlashcard.flashcardId.note}</p>
          </div>
          <div className="flex justify-center space-x-3"></div>
        </CardContent>
        {learningFlashcard.optimalTime && (
          <CardFooter className=" bottom-2 left-2 right-2 flex justify-between items-center">
            <Badge
              variant="outline"
              className="text-primary text-sm px-3 py-1 border-gray-600"
            >
              Thời gian học lại:{" "}
              {getDiffDays(learningFlashcard.optimalTime) + " "}
              ngày ( Thời gian ban đầu: {learningFlashcard.interval} ngày)
            </Badge>
            <div className="flex gap-2">
              {/* <Badge
                className={`${getScoreColor(
                  decayScore.toFixed(2)
                )} text-white text-sm px-3 py-1`}
              >
                Decay: {decayScore.toFixed(2)}
              </Badge> */}
              <Badge
                className={`${getCoefficientColor(
                  learningFlashcard.retentionScore.toFixed(2)
                )} text-white text-sm px-3 py-1`}
              >
                Điểm ghi nhớ: {learningFlashcard.retentionScore.toFixed(2)}
              </Badge>
            </div>
          </CardFooter>
        )}
      </Card>
    )
  );
}
