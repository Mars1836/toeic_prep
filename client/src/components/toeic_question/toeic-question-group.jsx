import React, { useState } from "react";

import { ToeicPart3Questions } from "./toeic-part3-questions";
import Image from "next/image";
import { ToeicPart6Questions } from "./toeic-part6-questions";
import { ToeicPart4Questions } from "./toeic-part4-questions";
import { ToeicPart7Questions } from "./toeic-part7-questions";
import { passage_0 } from "@/app/(defaultlayout)/test/part7.db";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const Passage = ({ passages = [] }) => {
  return (
    <div>
      {passages?.map((passage, index) => {
        return (
          <div key={index}>
            {!!index && <p className="my-2">===============================</p>}
            {passage.type === "html" && (
              <div
                className="passage font-medium"
                key={index}
                dangerouslySetInnerHTML={{ __html: passage.html }}
              />
            )}
            {passage.type === "image" && (
              <img
                src={passage.img}
                className="w-full"
                alt="Picture of the author"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
const Translate = ({ passages = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <span
        className="flex cursor-pointer items-center"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <p className="font-bold">Translate</p>
        {!isOpen ? (
          <ChevronDown strokeWidth={3} size={20} />
        ) : (
          <ChevronUp strokeWidth={3} size={20} />
        )}
      </span>
      {true && (
        <div
          className="overflow-hidden"
          style={{
            maxHeight: isOpen ? "2000px" : "0", // Set an appropriate max height
            transition: "max-height 0.5s ease",
          }}
        >
          {passages?.map((passage, index) => {
            return (
              <div key={index}>
                {!!index && (
                  <p className="my-2">===============================</p>
                )}
                <div
                  className="passage font-medium"
                  dangerouslySetInnerHTML={{ __html: passage.transcript }}
                />

                <br></br>
                <div
                  className="passage font-medium"
                  dangerouslySetInnerHTML={{ __html: passage.translate }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
function ToeicQuestionGroup({
  questions,
  handleChooseOption,
  answerList,
  isCheck,
}) {
  const question = questions[0];
  if (questions[0].type === "part3") {
    return (
      <div>
        <audio controls className="w-full">
          <source src={question.audio} type="audio/mpeg" />
        </audio>
        {questions.map((question) => {
          return (
            <div key={question.id}>
              <ToeicPart3Questions
                isCheck={isCheck}
                handleChooseOption={handleChooseOption(question.id)}
                question={question}
                optionChoosed={answerList[question.id]}
              ></ToeicPart3Questions>
            </div>
          );
        })}
      </div>
    );
  } else if (question.type === "part4") {
    return (
      <div>
        <audio controls className="w-full">
          <source src={question.audio} type="audio/mpeg" />
        </audio>
        {questions.map((question) => {
          return (
            <div key={question.id}>
              <ToeicPart4Questions
                isCheck={isCheck}
                handleChooseOption={handleChooseOption(question.id)}
                question={question}
                optionChoosed={answerList[question.id]}
              ></ToeicPart4Questions>
            </div>
          );
        })}
      </div>
    );
  } else if (question.type === "part6") {
    return (
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Passage passages={question.passages}></Passage>
        <div>
          {questions.map((question) => {
            return (
              <div key={question.id}>
                <ToeicPart6Questions
                  isCheck={isCheck}
                  handleChooseOption={handleChooseOption(question.id)}
                  question={question}
                  optionChoosed={answerList[question.id]}
                ></ToeicPart6Questions>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (question.type === "part7") {
    return (
      <div key={question.id}>
        <Passage passages={question.passages}></Passage>
        {questions.map((question) => {
          return (
            <div key={question.id}>
              <ToeicPart7Questions
                isCheck={isCheck}
                handleChooseOption={handleChooseOption(question.id)}
                question={question}
                optionChoosed={answerList[question.id]}
              ></ToeicPart7Questions>
            </div>
          );
        })}
        <Translate passages={question.passages} />
      </div>
    );
  }
  return <div>Question is not found</div>;
}

export default ToeicQuestionGroup;
