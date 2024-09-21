import React from "react";

import { ToeicPart3Questions } from "./toeic-part3-questions";
import Image from "next/image";
import { ToeicPart6Questions } from "./toeic-part6-questions";
import { ToeicPart4Questions } from "./toeic-part4-questions";
import { ToeicPart7Questions } from "./toeic-part7-questions";

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
            <div>
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
            <div>
              <ToeicPart4Questions
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
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="font-medium "
          dangerouslySetInnerHTML={{ __html: question.passages[0] }}
        />
        <div>
          {questions.map((question) => {
            return (
              <div>
                <ToeicPart6Questions
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
      <div>
        <Image
          src={question.img}
          width={500}
          height={500}
          alt="Picture of the author"
        ></Image>
        {questions.map((question) => {
          return (
            <div>
              <ToeicPart7Questions
                handleChooseOption={handleChooseOption(question.id)}
                question={question}
                optionChoosed={answerList[question.id]}
              ></ToeicPart7Questions>
            </div>
          );
        })}
      </div>
    );
  }
  return <div>Question is not found</div>;
}

export default ToeicQuestionGroup;
