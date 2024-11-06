"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { CheckCircle, ChevronLeft, ChevronRight, XCircle } from "lucide-react";

export function ToeicPart2Questions({
  question,
  handleChooseOption,
  answerList,
  isCheck,
}) {
  console.log(question, answerList[question.id]);
  const [selectedOption, setSelectedOption] = useState(answerList[question.id]);
  const handleOptionChange = (value) => {
    if (isCheck) {
      return;
    }
    setSelectedOption(value);
    handleChooseOption(value);
  };

  const isAnswerCorrect = () => {
    return question.answerKey === answerList[question.id];
  };
  useEffect(() => {
    setSelectedOption(answerList[question.id]);
  }, [question]);
  return (
    <div className="space-y-8 p-6">
      <p>Câu {question.number}</p>

      <audio controls className="w-full">
        <source src="/part1-1.mp3" type="audio/mpeg" />
      </audio>
      <div className="aspect-w-16 aspect-h-9 relative"></div>
      <RadioGroup
        value={selectedOption || ""}
        onValueChange={handleOptionChange}
        className="mb-4"
      >
        {question.options.map((option) => (
          <div key={option.id} className="mb-2 flex items-center space-x-2">
            <RadioGroupItem
              value={option.id}
              id={`q${question.id}-${option.id}`}
            />
            <Label htmlFor={`q${question.id}-${option.id}`}>
              {option.id}. {option.text}
            </Label>
            {isCheck && option.id === question.answerKey && (
              <CheckCircle className="ml-2 text-green-500" />
            )}
            {isCheck &&
              option.id === answerList[question.id] &&
              option.id !== question.answerKey && (
                <XCircle className="ml-2 text-red-500" />
              )}
          </div>
        ))}
      </RadioGroup>
      {isCheck && (
        <p
          className={`mt-4 font-bold ${
            isAnswerCorrect() ? "text-green-500" : "text-red-500"
          }`}
        >
          {isAnswerCorrect()
            ? "Correct!"
            : "Incorrect. The correct answer is " + question.answerKey + "."}
        </p>
      )}
    </div>
  );
}
