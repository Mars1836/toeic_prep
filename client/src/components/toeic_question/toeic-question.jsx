import React from "react";
import { ToeicPart1Questions } from "./toeic-part1-questions";
import { ToeicPart2Questions } from "./toeic-part2-questions";

function ToeicQuestion(props) {
  const { question } = props;
  if (question.type === "part1") {
    return (
      <div>
        <ToeicPart1Questions {...props}></ToeicPart1Questions>
      </div>
    );
  } else if (question.type === "part2") {
    return (
      <div>
        <ToeicPart2Questions {...props}></ToeicPart2Questions>
      </div>
    );
  }
  return <div>Question is not found</div>;
}

export default ToeicQuestion;
