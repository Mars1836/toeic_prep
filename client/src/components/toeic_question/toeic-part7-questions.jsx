"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { CheckCircle, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
// must be wrapped by ToeicQuestionGroup
export function ToeicPart7Questions({
  question,
  handleChooseOption,
  optionChoosed,
  isCheck,
}) {
  const [selectedOption, setSelectedOption] = useState(optionChoosed);

  const handleOptionChange = (value) => {
    if (isCheck) {
      return;
    }
    setSelectedOption(value);
    handleChooseOption(value);
  };

  const isAnswerCorrect = () => {
    return question.answerKey === optionChoosed;
  };
  return (
    <div className="p-6 space-y-8">
      <div className="aspect-w-16 aspect-h-9 relative"></div>
      <p>Câu {question.number}</p>
      <RadioGroup
        value={selectedOption || ""}
        onValueChange={handleOptionChange}
        className="mb-4"
      >
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 mb-2">
            <RadioGroupItem
              value={option.id}
              id={`q${question.id}-${option.id}`}
            />
            <Label htmlFor={`q${question.id}-${option.id}`}>
              {option.id}. {option.text}
            </Label>
            {isCheck && option.id === question.answerKey && (
              <CheckCircle className="text-green-500 ml-2" />
            )}
            {isCheck &&
              option.id === optionChoosed &&
              option.id !== question.answerKey && (
                <XCircle className="text-red-500 ml-2" />
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
