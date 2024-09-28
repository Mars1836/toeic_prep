"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { CheckCircle, ChevronLeft, ChevronRight, XCircle } from "lucide-react";

export function ToeicPart6Questions({
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
    <div className="space-y-8 p-6">
      {/* <div className="aspect-w-16 aspect-h-9 relative"></div> */}
      <p className="-mb-4 font-semibold">Câu {question.number}</p>
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
              className="min-w-4"
            />
            <Label htmlFor={`q${question.id}-${option.id}`}>
              {option.id}. {option.text}
            </Label>
            {isCheck && option.id === question.answerKey && (
              <CheckCircle className="ml-2 text-green-500" />
            )}
            {isCheck &&
              option.id === optionChoosed &&
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
