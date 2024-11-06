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
import React, { useEffect, useRef, useState } from "react";
import { questions as questionsDb, textOfTypeQues } from "../test/db";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Grid } from "lucide-react";
import ToeicQuestion from "@/components/toeic_question/toeic-question";
import ToeicQuestionGroup from "@/components/toeic_question/toeic-question-group";
import ChooseOption from "@/components/exam_question/choose_option";
import Clock from "@/components/clock";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "~components/ui/sheet";
const link = "https://storage.googleapis.com/simpl-project138_cloudbuild/file";

const idTest = 1;
function getAudio(name) {
  return link + `/audio/exam/${idTest}.${name}.mp3`;
}
function getExcel(name = `exam.${idTest}.mini-test${idTest}`) {
  return link + "/excel/" + name + ".xlsx";
}
function getImage(name) {
  return link + `/images/exam/${idTest}.${name}.jpg`;
}
function getTestAudio() {
  return "https://drive.google.com/file/d/1JykOYC6wZAcjSVurwI5LiBbQbsnlHYDS/view?usp=sharing";
}
function TestPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answerList, setAnswerList] = useState({});
  const [isCheck, setIsCheck] = useState(false);
  const [resultItems, setResultItems] = useState({});
  const [questionMap, setQuestionMap] = useState({});

  const handleFileUpload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(getExcel());
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });
      setData(jsonData);
    } catch (err) {
      setError(
        "Error parsing Excel file. Please make sure it's a valid .xlsx file."
      );
    } finally {
      setIsLoading(false);
    }
  };

  function handleCheckList() {
    const _resultItems = {};
    for (const [key, value] of Object.entries(answerList)) {
      _resultItems[key] = {
        // type: questionMap[key].type,
        useranswer: value,
        correctanswer: questionMap[key].correctanswer,
        isCorrect: questionMap[key].correctanswer === value,
      };
    }
    setResultItems(_resultItems);
  }
  function handleChooseOption(id) {
    return (value) => {
      setAnswerList((pre) => {
        return { ...pre, [id]: value };
      });
    };
  }
  function handleSelectQuestion(question) {
    const element = document.getElementById(question.number);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  function handleSubmitAnswer(e) {
    e.preventDefault();
    setIsCheck(true);
    handleCheckList();
  }
  useEffect(() => {
    if (data.length > 1) {
      const header = data[0];
      const list = [];
      const _questionMap = {};
      for (let i = 1; i < data.length; i++) {
        const arr = data[i];
        const questionItem = {
          id: arr[0],
          [header[0]]: arr[0],
          [header[1]]: arr[1],
          [header[2]]: arr[2],
          [header[3]]: arr[3],
          [header[4]]: arr[4],
          [header[5]]: arr[5],
          [header[6]]: arr[6],
          [header[7]]: arr[7],
          [header[8]]: arr[8],
          [header[9]]: arr[9],
        };
        const options = [arr[5], arr[6], arr[7], arr[8]];
        const labels = ["A", "B", "C", "D"];
        questionItem.options = options
          .map((op, index) => {
            if (!op) {
              return null;
            }
            return {
              id: labels[index],
              content: op,
            };
          })
          .filter((option) => option !== null);
        list.push(questionItem);
        _questionMap[arr[0]] = questionItem;
      }
      setQuestionMap(_questionMap);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);
  useEffect(() => {
    handleFileUpload();
  }, []);
  useEffect(() => {
    console.log(answerList);
  }, [answerList]);
  const handleAudioStart = (id, name) => {
    const url = getAudio(name);
    // "https://storage.googleapis.com/simpl-project138_cloudbuild/file/audio/exam/1.num1.mp3";
    const audioElement = document.getElementById("audio" + id);
    if (audioElement) {
      if (audioElement.src != url) {
        audioElement.src = url; // Gán source cho audio
        audioElement.load(); // Load audio
        audioElement.play(); // Tự động phát
      }
    }
  };
  return (
    <div className="container mx-auto px-2 py-8 lg:px-20">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-grow">
          {Object.values(questionMap).map((question) => {
            return (
              <div className="max-w-full" key={question.id}>
                <p className="font-semibold" id={question.number}>
                  Câu {question.number}
                </p>
                {question.paragraph && (
                  <div className="my-4 rounded border bg-blue-100 p-4">
                    <pre
                      style={{
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {question.paragraph}
                    </pre>
                  </div>
                )}

                {question.audio && (
                  <div className="m-4">
                    <audio
                      controls
                      className="custom-audio w-full"
                      src="/temp.mp3"
                      id={"audio" + question.id}
                      onPlay={() => {
                        handleAudioStart(question.id, question.audio);
                      }}
                    ></audio>
                  </div>
                )}
                {question.image && (
                  <div className="aspect-w-16 aspect-h-9 relative flex justify-center">
                    <Image
                      src={getImage(question.image)}
                      alt={`TOEIC Part 1 Question ${question.id} Image`}
                      className="rounded-lg"
                      width={600}
                      height={500}
                    />
                  </div>
                )}
                <ChooseOption
                  question={question}
                  handleChooseOption={handleChooseOption(question.id)}
                  isCheck={isCheck}
                ></ChooseOption>
              </div>
            );
          })}
        </div>

        {/* pc version */}
        <div className="hidden w-full min-w-64 md:w-64 lg:block"></div>
        <Card className="fixed right-32 hidden w-full min-w-64 md:w-64 lg:block">
          <Clock run={!isCheck}></Clock>
          {/* <CardHeader>
            <CardTitle>Question List</CardTitle>
          </CardHeader> */}
          <CardContent className="p-0">
            <div className="scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent grid max-h-[500px] grid-cols-4 gap-1 overflow-y-scroll p-4">
              {Object.values(questionMap).map((question, index) => {
                return (
                  <Button
                    key={question.id}
                    variant={
                      "selectedQuestion.id" === question.id
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
                      "selectedQuestion.id" === question.id
                        ? "ring-primary ring-offset-gray-90 ring-2 ring-offset-2" //dark:ring-offset-gray-900
                        : ""
                    } ${
                      resultItems[question.id]
                        ? resultItems[question.id].isCorrect
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                        : ""
                    } `}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
          </CardContent>
          <div className="mx-auto p-4">
            <Button asChild onClick={handleSubmitAnswer}>
              <Link href="/start-test">Submit</Link>
            </Button>
          </div>
        </Card>
        {/* mobile version */}
        <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white shadow-sm lg:hidden">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 justify-around">
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center justify-center"
              >
                <Clock className="h-5 w-5" />
                <span className="text-xs">05:22</span>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex flex-col items-center justify-center"
                  >
                    <Grid className="h-5 w-5" />
                    <span className="text-xs">Questions</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <div className="p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                      Question Navigator
                    </h3>
                    <ScrollArea className="h-[calc(80vh-8rem)]">
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 100 }, (_, i) => i + 1).map(
                          (num) => (
                            <Button
                              key={num}
                              variant="outline"
                              size="sm"
                              className="h-10 w-10"
                            >
                              {num}
                            </Button>
                          )
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default TestPage;
