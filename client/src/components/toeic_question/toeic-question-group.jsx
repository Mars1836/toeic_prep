import React from "react";

import { ToeicPart3Questions } from "./toeic-part3-questions";

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
              <ToeicPart3Questions
                handleChooseOption={handleChooseOption(question.id)}
                question={question}
                optionChoosed={answerList[question.id]}
              ></ToeicPart3Questions>
            </div>
          );
        })}
      </div>
    );
  }
  return <div>Question is not found</div>;
}

export default ToeicQuestionGroup;
