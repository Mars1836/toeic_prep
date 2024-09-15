import { ToeicPart1Questions } from "@/components/toeic_question/toeic-part1-questions";
import React from "react";

function TestPage() {
  return (
    <div className="py-12">
      <h1 className="text-2xl font-bold text-center">
        TOEIC Part 1: Picture Description
      </h1>
      <p className="text-muted-foreground text-center">
        Look at the picture and choose the statement that best describes the
        image.
      </p>
      <ToeicPart1Questions></ToeicPart1Questions>
    </div>
  );
}

export default TestPage;
