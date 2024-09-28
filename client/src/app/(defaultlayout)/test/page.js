"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import { questions as questionsDb, textOfTypeQues } from "./db";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ToeicQuestion from "@/components/toeic_question/toeic-question";
import ToeicQuestionGroup from "@/components/toeic_question/toeic-question-group";
import Clock from "@/components/clock";
const checkListForm = {
  asdasd: {
    type: "asdas",
    answer: "a",
    answerKey: "b",
    isRight: function () {
      return this.answer === this.answerKey;
    },
  },
};

function changeQuestionsToObjectWithIdsKey(questions = []) {
  const rs1 = questions.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.ids]: [...(acc[cur.ids] || []), cur],
    };
  }, {});
  return rs1;
}
function changeQuestionsToObjectWithIdKey(questions = []) {
  const rs1 = questions.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.id]: cur,
    };
  }, {});
  return rs1;
}
function getListIndexPart(questions = []) {
  const arr = [];
  for (let i = 0; i < questions.length; i++) {
    const curq = questions[i];
    const pre = arr[arr.length - 1];
    if (pre?.type !== curq.type) {
      arr.push({
        index: i,
        type: curq.type,
      });
    }
  }
  return arr;
}
function numberQuestion(questions = []) {
  return questions.map((questions, index) => {
    return {
      ...questions,
      number: index + 1,
    };
  });
}
function checkIsGroupTypePart(questionIdsList) {
  const listGroupPart = ["part6", "part7", "part3", "part4"];
  return !(
    questionIdsList.length > 0 &&
    listGroupPart.includes(questionIdsList[0].type)
  );
}
function TestPage() {
  const questions = numberQuestion(questionsDb);
  const listIndexPart = getListIndexPart(questions); // show part in button question number
  const questionsObject = changeQuestionsToObjectWithIdsKey(questions);
  const [isCheck, setIsCheck] = useState(false);
  const [questionIdsList, setQuestionIdsList] = useState(
    questionsObject[questions[0].ids]
  );
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [answerList, setAnswerList] = useState({});
  const [checkList, setCheckList] = useState({});
  function handleSelectQuestion(question) {
    console.log(question.ids);
    console.log(questionsObject[question.ids]);
    setSelectedQuestion(question);
    setQuestionIdsList(questionsObject[question.ids]);
  }
  function handleCheckList() {
    const questionObjectId = changeQuestionsToObjectWithIdKey(questions);
    const checkListForm = {};
    for (const [key, value] of Object.entries(answerList)) {
      checkListForm[key] = {
        type: questionObjectId[key].type,
        answer: value,
        answerKey: questionObjectId[key].answerKey,
        isRight: questionObjectId[key].answerKey === value,
      };
    }
    console.log();
    setCheckList(checkListForm);
  }
  function handleChooseOption(id) {
    return (value) => {
      setAnswerList((pre) => {
        return { ...pre, [id]: value };
      });
    };
  }
  function handleSubmitAnswer(e) {
    e.preventDefault();
    setIsCheck(true);
    handleCheckList();
  }

  useEffect(() => {
    console.log(isCheck);
  }, [isCheck]);
  return (
    <div className="container mx-auto px-4 py-8">
      <Clock run={!isCheck}></Clock>

      <div className="mb-6 flex justify-end">
        <Button asChild onClick={handleSubmitAnswer}>
          <Link href="/start-test">Submit</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-grow">
          {checkIsGroupTypePart(questionIdsList) ? (
            <ToeicQuestion
              question={questionIdsList[0]}
              isCheck={isCheck}
              handleChooseOption={handleChooseOption(questionIdsList[0].id)}
              optionChoosed={answerList[questionIdsList[0].id]}
            ></ToeicQuestion>
          ) : (
            <ToeicQuestionGroup
              isCheck={isCheck}
              answerList={answerList}
              questions={questionIdsList}
              handleChooseOption={handleChooseOption}
            ></ToeicQuestionGroup>
          )}
        </div>
        <Card className="w-full min-w-64 md:w-64">
          <CardHeader>
            <CardTitle>Question List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-4 gap-1 p-4">
                {questions.map((question, index) => {
                  return (
                    <>
                      {listIndexPart.map((item, ix) => {
                        if (item.index === index) {
                          return (
                            <span
                              className="col-span-4 px-2 font-semibold"
                              key={ix}
                            >
                              {textOfTypeQues[item.type]}
                            </span>
                          );
                        }
                        return;
                      })}
                      <Button
                        key={question.id}
                        variant={
                          selectedQuestion.id === question.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          handleSelectQuestion(question);
                        }}
                        className={`w-full transition-all duration-200 ${
                          answerList[question.id]
                            ? "bg-yellow-500 text-white hover:bg-yellow-300" //dark:bg-green-900 dark:hover:bg-green-800
                            : ""
                        } ${
                          selectedQuestion.id === question.id
                            ? "ring-primary ring-offset-gray-90 ring-2 ring-offset-2" //dark:ring-offset-gray-900
                            : ""
                        } ${
                          checkList[question.id]
                            ? checkList[question.id].isRight
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                            : ""
                        } `}
                      >
                        {index + 1}
                      </Button>
                    </>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TestPage;
