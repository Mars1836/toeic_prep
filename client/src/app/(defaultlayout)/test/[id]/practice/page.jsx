"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Grid } from "lucide-react";

import ChooseOption from "@/components/exam_question/choose_option";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "~components/ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import ClockCtrl from "@/components/clock";
import instance from "~configs/axios.instance";
import withAuth from "~HOC/withAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
function getAudio(endpoint, name, code) {
  return endpoint.originUrlUpload + `/audios/${code}/${name}.mp3`;
}
function getExcel(endpoint, name, code) {
  return endpoint.originUrlUpload + `/excels/${code}/` + name;
}
function getImage(endpoint, name, code) {
  return endpoint.originUrlUpload + `/images/${code}/${name}.jpg`;
}
const startedTime = new Date();
let pointedTime = new Date();

function TestPage({ params }) {
  const { endpoint } = useEndpoint();
  const [testData, setTestData] = useState();
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [answerList, setAnswerList] = useState({});
  const [isCheck, setIsCheck] = useState(false);
  const [resultItems, setResultItems] = useState({});
  const [questionMap, setQuestionMap] = useState({});
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const idTest = params.id;
  const searchParams = useSearchParams();
  const parts = searchParams.get("parts")?.split(",").map(Number) || [];
  const time = Number(searchParams.get("time")) * 60;
  const containerParts = [];
  const handleCounterParts = (part) => {
    if (!containerParts.includes(part)) {
      containerParts.push(part);
    }
  };
  async function handleFileUpload() {
    setLoadingData(true);
    setError(null);

    try {
      const response = await fetch(
        getExcel(endpoint, testData.fileName, testData.code)
      );
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
      setLoadingData(false);
    }
  }

  async function handleCheckList() {
    const _resultItems = {};
    for (const [key, value] of Object.entries(answerList)) {
      _resultItems[key] = {
        // type: questionMap[key].type,
        useranswer: value.value,
        correctanswer: questionMap[key].correctanswer,
        isCorrect: questionMap[key].correctanswer === value.value,
        part: questionMap[key].part,
        questionNum: questionMap[key].number,
        timeSecond: Math.round(value.timeSecond / 1000),
        questionCategory: questionMap[key].category,
      };
    }
    const dataFetch = {
      rs: {
        testId: testData.id,
        secondTime: Math.round((new Date() - startedTime) / 1000),
        numberOfQuestions: Object.values(questionMap).length,
        parts: parts,
      },
      rsis: Object.values(_resultItems),
    };
    const d = await instance.post(endpoint.result.storeResult, dataFetch);
    if (d?.data) {
      router.push(`/test/${idTest}/result/${d.data.id}`);
    }
    setResultItems(_resultItems);
  }
  function handleChooseOption(id) {
    return (value) => {
      setAnswerList((pre) => {
        const timeSecond = Math.round(new Date() - pointedTime);
        pointedTime = new Date();
        return { ...pre, [id]: { value, timeSecond } };
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
    setIsAlertOpen(true);
  }
  const confirmSubmit = () => {
    handleCheckList();
    setIsAlertOpen(false);
  };
  useEffect(() => {
    if (!data || data?.length === 0) {
      return;
    }
    if (data.length > 1) {
      const header = data[0];
      const list = [];
      const _questionMap = {};
      for (let i = 1; i < data.length; i++) {
        const arr = data[i];
        if (!parts.includes(arr[10])) {
          continue;
        }
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
          [header[10]]: arr[10], //part
          [header[11]]: arr[11].split(","), //category
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
    if (!testData) {
      return;
    }
    handleFileUpload();
  }, [testData]);
  useEffect(() => {}, [answerList]);
  const handleAudioStart = (id, name) => {
    const url = getAudio(endpoint, name, testData.code);
    const audioElement = document.getElementById("audio" + id);
    if (audioElement) {
      if (audioElement.src != url) {
        audioElement.src = url; // Gán source cho audio
        audioElement.load(); // Load audio
        audioElement.play(); // Tự động phát
      }
    }
  };
  useEffect(() => {
    async function fetchTestData() {
      const test = await instance.get(endpoint.test.getById, {
        params: {
          id: idTest,
        },
      });
      setTestData(test.data);
    }
    fetchTestData();
  }, []);
  useEffect(() => {
    console.log(questionMap);
  }, [questionMap]);
  return loadingData ? (
    <div className="flex justify-center items-center w-full mt-10">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    <>
      {questionMap && Object.values(questionMap).length > 0 && (
        <div className="container mx-auto px-2 py-8 lg:px-20">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-grow">
              {Object.values(questionMap).map((question, index) => {
                return (
                  <div key={question.id}>
                    {!containerParts.includes(question.part) && (
                      <h3 className="text-center text-2xl font-semibold mb-10">
                        Part {question.part}
                        {handleCounterParts(question.part)}
                      </h3>
                    )}

                    <div className="max-w-full" key={question.id}>
                      <p className="font-semibold mb-4" id={question.number}>
                        Câu {question.number}
                      </p>
                      {question.paragraph && (
                        <div className="mb-4 rounded border bg-blue-100 p-4">
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
                        <div className="mb-4">
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
                        <div className="aspect-w-16 aspect-h-9 relative flex justify-center mb-4">
                          <Image
                            src={getImage(
                              endpoint,
                              question.image,
                              testData.code
                            )}
                            alt={`TOEIC Part 1 Question ${question.id} Image`}
                            className="rounded-lg"
                            width={600}
                            height={500}
                          />
                        </div>
                      )}
                      {question.question && ![2].includes(question.part) && (
                        <div className="font-semibold mb-4">
                          <pre
                            style={{
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {question.question}
                          </pre>
                        </div>
                      )}
                      <ChooseOption
                        question={question}
                        handleChooseOption={handleChooseOption(question.id)}
                        isCheck={isCheck}
                      ></ChooseOption>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* pc version */}
            <div className="hidden w-full min-w-72 md:w-64 lg:block "></div>
            <Card className="fixed top-20 right-20 bottom-20 hidden w-full min-w-72 md:w-72 lg:block overflow-y-auto">
              {/* <ClockCtrl isRun={!isCheck} limit={100}></ClockCtrl> */}
              <ClockCtrl
                isRun={!isCheck}
                limit={time}
                onTimeOut={handleCheckList}
              ></ClockCtrl>
              {/* <CardHeader>
            <CardTitle>Question List</CardTitle>
          </CardHeader> */}
              <CardContent className="p-0">
                <div>
                  {parts.map((item, index1) => {
                    return (
                      <div key={index1}>
                        <p className="font-semibold text-sm mx-5">
                          Part {item}
                        </p>
                        <div className="scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent grid max-h-[500px] grid-cols-5 gap-1 overflow-y-scroll p-4">
                          {Object.values(questionMap).map((question, index) => {
                            if (question.part !== item) {
                              return;
                            }
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
                                  answerList[question.id]?.value
                                    ? "bg-yellow-500 text-white hover:bg-yellow-300"
                                    : ""
                                } ${
                                  "selectedQuestion.id" === question.id
                                    ? "ring-primary ring-offset-gray-90 ring-2 ring-offset-2"
                                    : ""
                                } ${
                                  resultItems[question.id]
                                    ? resultItems[question.id].isCorrect
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : "bg-red-500 text-white hover:bg-red-600"
                                    : ""
                                } `}
                              >
                                {question.number}
                                <p className="bg-red-200">{}</p>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
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
                    <ClockCtrl className="h-5 w-5" />
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
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn nộp bài không
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ lại trả lại kết quả và lưu vào dữ liệu của
                  bạn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={confirmSubmit}>
                  Xác nhận nộp
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}
export default withAuth(TestPage);
