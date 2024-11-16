import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle } from "lucide-react";
import React, { useState } from "react";

function ChooseOption({
  question,
  isCheck = false,
  value,
  handleChooseOption = () => {},
}) {
  const [selectedOption, setSelectedOption] = useState(value);
  const handleOptionChange = (value) => {
    if (isCheck) {
      return;
    }
    setSelectedOption(value);
    handleChooseOption(value);
  };
  const isAnswerCorrect = () => {
    return question.correctanswer === selectedOption;
  };
  return (
    <div>
      <RadioGroup
        value={selectedOption || ""}
        onValueChange={handleOptionChange}
        className="mb-4 mt-12"
      >
        {question.options.map((option, index) => (
          <div key={option.id} className="mb-2 flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={`q${question.id}-${index}`} />
            <Label htmlFor={`q${question.id}-${index}`}>
              {option.id}
              {!isCheck &&
                ![1, 2].includes(question.part) &&
                `.${option.content}`}
              {isCheck && `.${option.content}`}
            </Label>

            {isCheck && option.id === question.correctanswer && (
              <CheckCircle className="ml-2 text-green-500" />
            )}
            {isCheck &&
              option.id === selectedOption &&
              option.id !== question.correctanswer && (
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
            : "Incorrect. The correct answer is " +
              question.correctanswer +
              "."}
        </p>
      )}
    </div>
  );
}

export default ChooseOption;
