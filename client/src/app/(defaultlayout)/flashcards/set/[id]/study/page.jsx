"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, X, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { filterObject, handleErrorWithToast } from "~helper";
import instance from "~configs/axios.instance";
import { endpoint } from "~consts";
const FILTER_FLASHCARD_DATA = [
  "id",
  "word",
  "translation",
  "definition",
  "note",
];
async function getLearningFlashcardData(learningSetId) {
  try {
    const res = await instance.get(endpoint.learningFlashcard.getBySet, {
      params: {
        learningSetId: learningSetId,
      },
    });
    return res.data;
  } catch (error) {
    handleErrorWithToast(error);
  }
}
async function simulateGetDataFromAI(prompt) {
  const rs =
    '[{"flashcardId": "6735c30fc1ce28d58c2c1a9e", "quiz": {"correctAnswer": "serenity", "options": ["anxiety", "chaos", "serenity", "turmoil"], "question": "Which word means \\"the state of being calm, peaceful, and untroubled\\"?"}, "word": "serenity"}, {"flashcardId": "6735c30fc1ce28d58c2c1a9f", "quiz": {"correctAnswer": "tranquility", "options": ["tranquility", "disturbance", "agitation", "noise"], "question": "What word describes a state of peace and calm?"}, "word": "tranquility"}, {"flashcardId": "6735c30fc1ce28d58c2c1aa0", "quiz": {"correctAnswer": "calmness", "options": ["panic", "calmness", "excitement", "stress"], "question": "Which word refers to the quality of being free from agitation?"}, "word": "calmness"}]\n';
  await new Promise((res) => setTimeout(res, 2000));

  return rs;
}
async function getQuizDataFromAI(prompt) {
  const { data } = await instance.post(endpoint.aichat.getQuizData, {
    prompt,
  });
  return data;
}
async function updateTrackingMapFetch(id, score) {
  // try {
  //   await instance.post(endpoint.learningFlashcard.updateShortTermScore, {
  //     learningFlashcardId: id,
  //     score,
  //   });
  // } catch (error) {
  //   handleErrorWithToast(error);
  // }
}
async function getLearningSetData(setFlashcardId) {
  try {
    const res = await instance.get(endpoint.learningSet.getBySet, {
      params: {
        setFlashcardId: setFlashcardId,
      },
    });
    return res.data;
  } catch (error) {
    handleErrorWithToast(error);
  }
}
const diffLevels = [
  { value: 1, label: "Khó nhớ" }, // Rất khó, cần ôn tập thường xuyên.
  { value: 0.6, label: "Tương đối khó" }, // Khó, nhưng có thể ghi nhớ với nỗ lực trung bình.
  { value: 0.3, label: "Dễ nhớ" }, // Nội dung dễ tiếp thu, chỉ cần ôn tập nhẹ nhàng.
  { value: 0, label: "Rất dễ nhớ" }, // Rất dễ, ít cần lặp lại.
];

// const slides = [
//   //   {
//   //     type: "confidence",
//   //     word: "Xin chào",
//   //     meaning: "Hello",
//   //     example: "Xin chào, bạn khỏe không?",
//   //   },
//   //   {
//   //     type: "confidence",
//   //     word: "Xin chàoo",
//   //     meaning: "Hello",
//   //     example: "Xin chào, bạn khỏe không?",
//   //   },
//   //   {
//   //     type: "quiz",
//   //     word: "Xin chào",
//   //     meaning: "Hello",
//   //     example: "Xin chào, bạn khỏe không?",
//   //   },
//   //   {
//   //     type: "multiple-choice",
//   //     word: "Xin chào",
//   //     meaning: "Hello",
//   //     options: ["Goodbye", "Thank you", "Hello", "How are you"],
//   //   },
//   //   { type: "writing", word: "Xin chào", meaning: "Hello" },
//   //   {
//   //     type: "confidence",
//   //     word: "Cảm ơn",
//   //     meaning: "Thank you",
//   //     example: "Cảm ơn bạn rất nhiều.",
//   //   },
//   //   {
//   //     type: "quiz",
//   //     word: "Cảm ơn",
//   //     meaning: "Thank you",
//   //     example: "Cảm ơn bạn rất nhiều.",
//   //   },
//   //   {
//   //     type: "multiple-choice",
//   //     word: "Cảm ơn",
//   //     meaning: "Thank you",
//   //     options: ["Please", `You're welcome`, "Thank you", "Sorry"],
//   //   },
//   //   { type: "writing", word: "Cảm ơn", meaning: "Thank you" },
//   //   {
//   //     type: "confidence",
//   //     word: "Tạm biệt",
//   //     meaning: "Goodbye",
//   //     example: "Tạm biệt, hẹn gặp lại.",
//   //   },
//   //   {
//   //     type: "quiz",
//   //     word: "Tạm biệt",
//   //     meaning: "Goodbye",
//   //     example: "Tạm biệt, hẹn gặp lại.",
//   //   },
//   //   {
//   //     type: "multiple-choice",
//   //     word: "Tạm biệt",
//   //     meaning: "Goodbye",
//   //     options: ["Hello", "Goodbye", "See you later", "Good night"],
//   //   },
//   //   { type: "writing", word: "Tạm biệt", meaning: "Goodbye" },
// ];

export default function FlashcardLearning({ params }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordDifficulty, setWordDifficulty] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const { id } = params;
  const [indexWord, setIndexWord] = useState({
    start: 0,
    end: 0,
  });

  const [learningFlashcardData, setLearningFlashcardData] = useState([]);
  const [trackingMap, setTrackingMap] = useState({});
  const [slides, setSlides] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [firstTimeCheck, setFirstTime] = useState(true);
  let currentSlide = slides[currentIndex];
  useEffect(() => {
    resetUserInputs();
  }, [currentIndex]);

  const handleNext = () => {
    if (wordDifficulty) {
      handleDiffScore(currentSlide.id, Number(wordDifficulty));
    }
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Bạn đã hoàn thành bài học!");
    }
  };
  const handleDiffScore = (id, value) => {
    setTrackingMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        difficult_rate: 1,
      },
    }));
    // updateTrackingMapFetch(id, trackingMap[id] + Number(value));
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };
  const addDifficultySlide = (learningFlashcardDataSlice) => {
    const slidesArray = [];
    for (const item of learningFlashcardDataSlice) {
      const slide = {
        id: item.id,
        type: "confidence",
        flashcardId: item.flashcardId.id,
        word: item.flashcardId.word,
        meaning: item.flashcardId.translation,
        example: item.flashcardId.exampleSentence[0],
      };
      slidesArray.push(slide);
    }
    setSlides((prev) => [...prev, ...slidesArray]);
  };
  const addQuizSlide = async (learningFlashcardDataSlice) => {
    try {
      const dataFromAI = await simulateGetDataFromAI(
        learningFlashcardDataSlice.map((item) =>
          filterObject(item.flashcardId, FILTER_FLASHCARD_DATA)
        )
      );

      const data = JSON.parse(dataFromAI);
      const slidesArray = [];
      for (const item of data) {
        const slide = {
          id: item.id,
          type: "multiple-choice",
          flashcardId: item.flashcardId,
          word: item.word,
          question: item.quiz ? item.quiz.question : "",
          meaning: item.quiz ? item.quiz.correctAnswer : "",
          options: item.quiz ? item.quiz.options : [],
          point: 0.5,
        };
        slidesArray.push(slide);
      }
      setSlides((prev) => [...prev, ...slidesArray]);
    } catch (error) {
      handleErrorWithToast(error);
    }
  };
  const addWritingSlide = async (learningFlashcardDataSlice) => {
    try {
      const slidesArray = [];
      for (const item of learningFlashcardDataSlice) {
        const slide = {
          id: item.id,
          type: "writing",
          word: item.flashcardId.word,
          translation: item.flashcardId.translation,
        };
        slidesArray.push(slide);
      }
      setSlides((prev) => [...prev, ...slidesArray]);
    } catch (error) {
      handleErrorWithToast(error);
    }
  };
  const handleIncreaseIndexWord = async (max) => {
    const step = 3;
    let newStart = indexWord.start;
    let newEnd = indexWord.end;
    if (indexWord.end + step > max && indexWord.start + step <= max) {
      newStart = indexWord.end;
      newEnd = max;
      setIndexWord({
        start: newStart,
        end: newEnd,
      });
    } else if (indexWord.end + step <= max) {
      newStart = indexWord.end;
      newEnd = indexWord.end + step;
      setIndexWord({
        start: newStart,
        end: newEnd,
      });
    } else if (indexWord.end + step > max) {
      newStart = max;
      newEnd = max;
      setIndexWord({
        start: max,
        end: max,
      });
    }

    const learningFlashcardDataSlice = learningFlashcardData.slice(
      newStart,
      newEnd
    );
    addDifficultySlide(learningFlashcardDataSlice);
    // addQuizSlide(learningFlashcardDataSlice);
    addWritingSlide(learningFlashcardDataSlice);
  };
  const resetUserInputs = () => {
    setWordDifficulty("");
    setUserAnswer("");
    setSelectedOption("");
    setIsCorrect(null);
    setShowAnswer(false);
    setFirstTime(true);
  };
  const handleShowAnswer = () => {
    // setFirstTime(false);
    setShowAnswer(true);
  };
  const handleWordDifficultyChange = (value) => {
    setWordDifficulty(value);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsCorrect(option === currentSlide.meaning);
  };

  const handleAnswerWritingSubmit = () => {
    const isAnswerCorrect =
      userAnswer.toLowerCase() === currentSlide.word.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    if (firstTimeCheck) {
      const num_of_quiz = trackingMap[currentSlide.id].num_of_quiz;
      const accuracy = trackingMap[currentSlide.id].accuracy;
      if (isAnswerCorrect) {
        setTrackingMap((prev) => ({
          ...prev,
          [currentSlide.id]: {
            ...prev[currentSlide.id],
            accuracy: (
              (1 + num_of_quiz * accuracy) /
              (num_of_quiz + 1)
            ).toFixed(2),
            num_of_quiz: num_of_quiz + 1,
          },
        }));
      } else {
        setTrackingMap((prev) => ({
          ...prev,
          [currentSlide.id]: {
            ...prev[currentSlide.id],
            accuracy: (
              (0 + num_of_quiz * accuracy) /
              (num_of_quiz + 1)
            ).toFixed(2),
            num_of_quiz: num_of_quiz + 1,
          },
        }));
        const wrongWritingSlide = {
          id: currentSlide.id,
          type: "writing",
          word: currentSlide.word,
          translation: currentSlide.translation,
        };
        setSlides((prev) => [...prev, wrongWritingSlide]);
      }
      setFirstTime(false);
    }
  };
  const handleFinish = () => {
    alert("Bạn đã hoàn thành bài học!");
  };
  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
  };
  const getDataFromLearningcardData = () => {};
  const renderSlideContent = () => {
    if (currentSlide) {
      switch (currentSlide.type) {
        case "confidence":
          return (
            <div className="space-y-6 w-full max-w-2xl">
              <h2 className="text-2xl font-semibold text-center mb-8 text-purple-700">
                {currentSlide.word}
              </h2>
              <p className="text-xl text-center mb-6 text-gray-600">
                Bạn đã thuộc từ này ở mức nào?
              </p>
              <RadioGroup
                value={wordDifficulty}
                onValueChange={handleWordDifficultyChange}
                className="grid grid-cols-1 gap-3"
              >
                {diffLevels.map((level) => (
                  <Label
                    key={level.value}
                    htmlFor={`confidence-${level.value}`}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                      wordDifficulty === level.value
                        ? "bg-purple-100 border-purple-500"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <RadioGroupItem
                      value={level.value}
                      id={`confidence-${level.value}`}
                    />
                    <span className="text-lg">{level.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          );
        case "quiz":
          return (
            <div className="space-y-6 text-center">
              <h2 className="text-4xl font-bold mb-8 text-purple-700">
                Ý nghĩa của từ "{currentSlide.word}" là gì?
              </h2>
              <p className="text-3xl font-semibold mb-6 text-blue-600">
                {currentSlide.meaning}
              </p>
              <p className="text-xl italic text-gray-600">
                Ví dụ: {currentSlide.example}
              </p>
            </div>
          );
        case "multiple-choice":
          return (
            <div className="space-y-6 w-full max-w-2xl">
              <h2 className="text-2xl font-semibold text-center mb-8 text-purple-700">
                {currentSlide.question}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {currentSlide.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === option ? "default" : "outline"}
                    className={`w-full justify-start text-left text-lg py-4 ${
                      isCorrect !== null && option === currentSlide.meaning
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {isCorrect !== null && (
                <p
                  className={`text-center text-xl font-semibold ${
                    isCorrect ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isCorrect ? "Chính xác!" : "Chưa chính xác. Thử lại nhé!"}
                </p>
              )}
            </div>
          );
        case "writing":
          return (
            <div className="space-y-6 w-full max-w-2xl">
              <h2 className="text-2xl font-semibold text-center mb-8 text-purple-700">
                What is the word that has the meaning '
                {currentSlide.translation}'?
              </h2>
              <Input
                type="text"
                placeholder="Nhập từ tiếng anh"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-center text-xl py-6"
              />
              <div className="flex space-x-4">
                <Button
                  onClick={handleAnswerWritingSubmit}
                  className="flex-1 text-lg py-6"
                >
                  Check
                </Button>
                <Button
                  onClick={handleShowAnswer}
                  variant="outline"
                  className="flex-1 text-lg py-6"
                >
                  <Eye className="mr-2 h-5 w-5" /> Show answer
                </Button>
              </div>
              {isCorrect !== null && (
                <div
                  className={`flex items-center justify-center text-xl ${
                    isCorrect ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="mr-2 h-6 w-6" />
                  ) : (
                    <X className="mr-2 h-6 w-6" />
                  )}
                  {isCorrect ? "Chính xác!" : "Chưa chính xác. Thử lại nhé!"}
                </div>
              )}
              {showAnswer && (
                <p className="text-center text-xl font-semibold text-blue-600">
                  Đáp án: {currentSlide.word}
                </p>
              )}
            </div>
          );
        default:
          return null;
      }
    }
  };

  useEffect(() => {
    console.log(trackingMap);
  }, [trackingMap]);
  useEffect(() => {
    if (currentIndex > slides.length - 3) {
      if (
        learningFlashcardData.length &&
        learningFlashcardData.length === indexWord.start
      ) {
        // alert("Bạn đã hoàn thành bài học!");
        return;
      }
      if (indexWord.start < indexWord.end) {
        handleIncreaseIndexWord(learningFlashcardData.length);
      }
    }
  }, [currentIndex, slides]);
  useEffect(() => {
    if (learningFlashcardData.length > 0) {
      handleIncreaseIndexWord(learningFlashcardData.length);
      const opt = {};
      console.log(learningFlashcardData);
      learningFlashcardData.forEach((item) => {
        opt[item.id] = {
          difficult_rate: item.value, // Độ dễ 0-5
          accuracy: 0, // Độ chính xác 0-1,
          num_of_quiz: 0, //so luong cau hoi
        };
      });
      setTrackingMap(opt);
    }
  }, [learningFlashcardData]);

  useEffect(() => {
    async function fetchData() {
      const learningSetData = await getLearningSetData(id);
      const learningFlashcardData = await getLearningFlashcardData(
        learningSetData.id
      );
      setLearningFlashcardData(learningFlashcardData);
    }

    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
            className="w-full"
          >
            <Card className="w-full shadow-lg">
              <CardContent className="p-8 h-[600px] flex flex-col justify-between">
                <div className="w-full h-full flex flex-col justify-center items-center overflow-y-auto">
                  {renderSlideContent()}
                </div>
                <div className="flex justify-between w-full mt-6">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    size="lg"
                    className="text-lg"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" /> Trước
                  </Button>
                  <Button onClick={handleNext} size="lg" className="text-lg">
                    {currentIndex === slides.length - 1
                      ? "Kết thúc"
                      : "Tiếp theo"}{" "}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        <div className="text-center mt-6">
          <Button
            onClick={handleFinish}
            size="lg"
            className="text-lg w-full py-8 bg-gray-800 text-white hover:bg-gray-900"
          >
            Kết thúc
          </Button>
        </div>
      </div>
    </div>
  );
}
