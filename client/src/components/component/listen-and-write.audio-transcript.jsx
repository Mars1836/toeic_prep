"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PronunciationChecker from "./listen-and-write.audio-record";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Mic } from "lucide-react";
import { originUrlUpload } from "@/consts";
function splitAndIndexWords(input) {
  const regex = /\b[\w']+\b/g; // Biểu thức chính quy tìm từ
  let match;
  const result = [];

  while ((match = regex.exec(input)) !== null) {
    result.push({
      word: match[0].toLowerCase(), // Từ đã chuyển về chữ thường
      index: match.index, // Vị trí bắt đầu của từ trong chuỗi
    });
  }

  return result;
}

function splitAndLowercase(input) {
  // Tách chuỗi thành các từ và chuyển tất cả về chữ thường
  return (input.match(/\b[\w']+\b/g) || []).map((word) => word.toLowerCase());
}

const AudioTranscription = ({
  question,
  handleNext,
  handlePrevious,
  indexQuestion,
  totalQuestion,
}) => {
  const [userInput, setUserInput] = useState("");
  const [correctTranscript, setCorrectTranscript] = useState(
    question.transcript
  );
  const [audioUrl, setAudioUrl] = useState(question.audioUrl);
  const [checkResult, setCheckResult] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const audioRef = useRef(null);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setIsChecked(false);
  };
  const checkTranscription = () => {
    const userWords = splitAndLowercase(userInput.trim());
    const correctWords = splitAndIndexWords(correctTranscript);

    let allCorrect = false;
    let index = 0;
    const result = [];
    let numWord = -1;
    let isFalsePart = false;
    for (let i = 0; i < userWords.length; i++) {
      if (i > correctWords.length - 1) {
        break;
      }

      if (userWords[i] === correctWords[i].word) {
        numWord = i;
        let preIndex = index;
        if (i === correctWords.length - 1) {
          result.push({
            word: correctTranscript.slice(index),
            status: "correct",
          });
          allCorrect = true;
          break;
        }
        index = correctWords[i + 1].index;

        result.push({
          word: correctTranscript.slice(preIndex, index),
          status: "correct",
        });
      } else {
        numWord = i;
        isFalsePart = true;
        let preIndex = index;
        allCorrect = false;

        if (i === correctWords.length - 1) {
          result.push({
            word: correctTranscript.slice(index),
            status: "incorrect",
          });
          break;
        }
        index = correctWords[i + 1].index;
        result.push({
          word: correctTranscript.slice(preIndex, index),
          status: "incorrect",
        });
        break;
      }
    }
    if (!isFalsePart && !allCorrect) {
      if (numWord < correctWords.length) {
        if (numWord + 2 < correctWords.length) {
          result.push({
            word: correctTranscript.slice(
              index,
              correctWords[numWord + 2].index
            ),
            status: "next",
          });
        } else {
          result.push({
            word: correctTranscript.slice(index),
            status: "next",
          });
        }
      }
    }

    setCheckResult(result);
    setIsChecked(true);
    setIsCorrect(allCorrect);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const getInputStyles = (index) => {
    if (!isChecked || index >= checkResult.length) return "";
    return checkResult[index].status === "correct"
      ? "text-green-600"
      : "text-red-600";
  };
  useEffect(() => {
    setCorrectTranscript(question.transcript);
    setAudioUrl(question.audioUrl);
    setUserInput("");
    setIsChecked(false);
    setIsCorrect(false);
    setCheckResult([]);
    console.log(question);
  }, [question]);
  return (
    <Card className="w-full max-w-3xl mx-auto" key={question.id}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Thực hành nghe chép</span>
          <span className="text-sm text-muted-foreground">
            Câu {indexQuestion + 1} / {totalQuestion}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          {audioUrl && (
            <audio controls>
              <source src={originUrlUpload + audioUrl} type="audio/mp3" />
            </audio>
          )}
        </div>
        <div>
          <Input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Nhập nội dung bạn nghe được..."
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={checkTranscription}> Kiểm tra </Button>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Mic className="w-4 h-4 mr-2" />
                  Thực hành phát âm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thực hành phát âm</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <PronunciationChecker question={question} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {isCorrect && <p className="text-green-600 font-semibold">Đúng!</p>}
        </div>
        {isChecked && (
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="font-semibold">Nội dung bạn nhập:</p>
            <p>
              {userInput.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={"font-bold " + getInputStyles(index)}
                >
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>
        )}
        {isChecked && checkResult.length > 0 && (
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="font-semibold">Kết quả:</p>
            <p>
              {checkResult.map((result, index) => (
                <span
                  key={index}
                  className={
                    "font-bold " +
                    (result.status === "correct"
                      ? "text-green-600"
                      : result.status === "incorrect"
                      ? "text-red-600"
                      : "text-yellow-600 ")
                  }
                >
                  {result.word}{" "}
                </span>
              ))}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={indexQuestion === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Trước
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={indexQuestion === totalQuestion - 1}
        >
          Sau
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AudioTranscription;
