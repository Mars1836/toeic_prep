"use client";

import React, { useState, useEffect } from "react";
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
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUpDown } from "lucide-react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getLearningFlashcardData, getLearningSetData } from "~fetch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { WordResultsCard } from "@/components/component/flashcard_quiz_result";
import { Badge } from "~components/ui/badge";
const FILTER_FLASHCARD_DATA = [
  "id",
  "word",
  "translation",
  "definition",
  "note",
];
function getDiffDays(optimalTime) {
  return (
    (new Date(optimalTime).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24)
  ).toFixed(2);
}
function getRateDiffDays(learningFlashcard) {
  const diffDays = getDiffDays(learningFlashcard.optimalTime);
  let rate = diffDays / learningFlashcard.interval;
  if (!isFinite(rate)) {
    rate = 0.2;
  }
  return rate;
}
function sortFlashcard(learningFlashcards) {
  let arr = learningFlashcards.map((fc) => {
    return {
      ...fc,
      rateDiffDays: getRateDiffDays(fc),
    };
  });
  arr.sort((a, b) => {
    return a.rateDiffDays - b.rateDiffDays;
  });
  arr.forEach((fc) => {});
  return arr;
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

const diffLevels = [
  { value: 0, label: "Khó nhớ" }, // Rất khó, cần ôn tập thường xuyên.
  { value: 0.3, label: "Tương đối khó" }, // Khó, nhưng có thể ghi nhớ với nỗ lực trung bình.
  { value: 0.6, label: "Dễ nhớ" }, // Nội dung dễ tiếp thu, chỉ cần ôn tập nhẹ nhàng.
  { value: 1, label: "Rất dễ nhớ" }, // Rất dễ, ít cần lặp lại.
];
const timeStart = new Date().getTime();
const fillInBlankSlide = {
  type: "fill-in-blank",
  sentence: "Xin _____, bạn khỏe không?",
  answer: "chào",
};
const matchingSlide = {
  type: "matching",
  pairs: [
    { vietnamese: "Xin chào", english: "Hello" },
    { vietnamese: "Tạm biệt", english: "Goodbye" },
    { vietnamese: "Cảm ơn", english: "Thank you" },
    { vietnamese: "Không có chi", english: "You're welcome" },
  ],
  jumbledPairs: [],
};
const wordOrderingSlide = {
  type: "word-ordering",
  sentence: "Xin chào bạn khỏe không",
  jumbledSentences: ["bạn", "khỏe", "không", "Xin", "chào"],
};
const multipleChoiceSlide = {
  type: "multiple-choice",
  word: "Hello",
  meaning: "Xin chào",
  options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Không có chi"],
  question: function () {
    return `What is the meaning of ${this.word}?`;
  },
};
async function createQuizSlice(learningFlashcard, type) {
  let data;
  try {
    data = await instance.get(endpoint.word.get4RandomWords);
  } catch (error) {
    handleErrorWithToast(error);
  }
  let { data: randomWords } = data;
  let correctAnswer = Math.floor(Math.random() * 4);

  if (type === "description") {
    const options = randomWords.map((item) => item.description);
    options[correctAnswer] = learningFlashcard.flashcardId.definition;
    return {
      id: learningFlashcard.id,
      type: "multiple-choice",
      word: learningFlashcard.flashcardId.word,
      correctAnswer: correctAnswer,
      options: options,
      question: function () {
        return `What is the description of ${this.word}?`;
      },
    };
  }
  if (type === "translation") {
    const options = randomWords.map((item) => item.translation);
    options[correctAnswer] = learningFlashcard.flashcardId.translation;
    return {
      id: learningFlashcard.id,
      type: "multiple-choice",
      word: learningFlashcard.flashcardId.word,
      correctAnswer: correctAnswer,
      options: options,
      question: function () {
        return `What is the translation of ${this.word}?`;
      },
    };
  }
}
function createMatchingSlide(learningFlashcards) {
  const pairs = learningFlashcards.map((item) => ({
    vietnamese: item.flashcardId.translation,
    english: item.flashcardId.word,
    id: item.id,
  }));
  const englishs = pairs
    .map((item, index) => ({
      word: item.english,
      pairIndex: index,
      isMatched: false,
      id: item.id,
    }))
    .sort(() => Math.random() - 0.5);
  const vietnamese = pairs
    .map((item, index) => ({
      word: item.vietnamese,
      pairIndex: index,
      isMatched: false,
      id: item.id,
    }))
    .sort(() => Math.random() - 0.5);

  return {
    type: "matching",

    pairs,
    jumbledPairs: [englishs, vietnamese],
  };
}
function createOrderingSlide(sentence, id) {
  if (!sentence) {
    return;
  }
  const words = sentence.split(" ");
  return {
    type: "word-ordering",
    id,
    sentence,
    jumbledSentences: words.sort(() => Math.random() - 0.5),
  };
}
export default function FlashcardLearning({ params }) {
  const { endpoint } = useEndpoint();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordDifficulty, setWordDifficulty] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const { id } = params;
  const [orderedWords, setOrderedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([[], []]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();
  const [indexWord, setIndexWord] = useState({
    start: 0,
    end: 0,
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [learningFlashcardData, setLearningFlashcardData] = useState([]);
  const [trackingMap, setTrackingMap] = useState({});
  const [slides, setSlides] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [firstTimeCheck, setFirstTimeCheck] = useState(true);
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
        difficult_rate: value,
        isChangeDifficulty: true,
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
  const addMatchingSlide = (learningFlashcardDataSlice) => {
    const s1 = createMatchingSlide(learningFlashcardDataSlice);
    setSlides((prev) => [...prev, s1]);
  };
  const addOrderingSlide = (learningFlashcardDataSlice) => {
    try {
      const slidesArray = [];
      for (const item of learningFlashcardDataSlice) {
        const s = createOrderingSlide(
          item.flashcardId.exampleSentence[0],
          item.id
        );
        slidesArray.push(s);
      }
      setSlides((prev) => [...prev, ...slidesArray]);
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const addQuizAISlide = async (learningFlashcardDataSlice) => {
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
  const addQuizSlide = async (learningFlashcardDataSlice) => {
    try {
      const slidesArray = [];
      for (const item of learningFlashcardDataSlice) {
        const slide = await createQuizSlice(item, "description");
        slidesArray.push(slide);
      }
      for (const item of learningFlashcardDataSlice) {
        const slide = await createQuizSlice(item, "translation");
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
    addQuizSlide(learningFlashcardDataSlice);
    addMatchingSlide(learningFlashcardDataSlice);
    // addQuizSlide(learningFlashcardDataSlice);
    addWritingSlide(learningFlashcardDataSlice);
    addOrderingSlide(learningFlashcardDataSlice);
  };
  const resetUserInputs = () => {
    setWordDifficulty("");
    setUserAnswer("");
    setSelectedOption("");
    setIsCorrect(null);
    setShowAnswer(false);
    setFirstTimeCheck(true);
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
    const isCorrect = option === currentSlide.correctAnswer;
    setIsCorrect(isCorrect);
    if (isCorrect) {
      handleAccuracyWhenCorrect(currentSlide.id);
    } else {
      handleAccuracyWhenWrong(currentSlide.id);
    }
  };
  const handleAccuracyWhenCorrect = (id) => {
    if (firstTimeCheck) {
      const num_of_quiz = trackingMap[id].num_of_quiz;
      const accuracy = trackingMap[id].accuracy;
      setTrackingMap((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          accuracy: ((1 + num_of_quiz * accuracy) / (num_of_quiz + 1)).toFixed(
            2
          ),
          num_of_quiz: num_of_quiz + 1,
        },
      }));
    }
    setFirstTimeCheck(false);
  };
  const handleAccuracyWhenWrong = (id) => {
    if (firstTimeCheck) {
      const num_of_quiz = trackingMap[id].num_of_quiz;
      const accuracy = trackingMap[id].accuracy;
      setTrackingMap((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          accuracy: ((0 + num_of_quiz * accuracy) / (num_of_quiz + 1)).toFixed(
            2
          ),
          num_of_quiz: num_of_quiz + 1,
        },
      }));
    }
    setFirstTimeCheck(false);
  };
  const handleAnswerWritingSubmit = () => {
    const isAnswerCorrect =
      userAnswer.toLowerCase() === currentSlide.word.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    if (firstTimeCheck) {
      const num_of_quiz = trackingMap[currentSlide.id].num_of_quiz;
      const accuracy = trackingMap[currentSlide.id].accuracy;
      if (isAnswerCorrect) {
        handleAccuracyWhenCorrect(currentSlide.id);
      } else {
        handleAccuracyWhenWrong(currentSlide.id);
        const wrongWritingSlide = {
          id: currentSlide.id,
          type: "writing",
          word: currentSlide.word,
          translation: currentSlide.translation,
        };
        setSlides((prev) => [...prev, wrongWritingSlide]);
      }
    }
  };
  const handleAnswerSubmit = () => {
    let isAnswerCorrect = false;
    if (currentSlide.type === "word-ordering") {
      isAnswerCorrect = orderedWords.join(" ") === currentSlide.sentence;
      if (isAnswerCorrect) {
        handleAccuracyWhenCorrect(currentSlide.id);
      } else {
        handleAccuracyWhenWrong(currentSlide.id);
      }
    } else if (currentSlide.type === "fill-in-blank") {
      isAnswerCorrect =
        userAnswer.toLowerCase() === currentSlide.answer.toLowerCase();
      if (isAnswerCorrect) {
        handleAccuracyWhenCorrect(currentSlide.id);
      } else {
        handleAccuracyWhenWrong(currentSlide.id);
      }
    }
    setIsCorrect(isAnswerCorrect);
  };
  const handleFinish = async () => {
    const timeEnd = new Date().getTime();
    const timeMinutes = (timeEnd - timeStart) / 1000 / 60; // minutes
    const data = Object.keys(trackingMap)
      .map((key) => {
        if (!trackingMap[key].num_of_quiz) {
          return null;
        }
        if (!trackingMap[key]?.difficult_rate) {
          trackingMap[key].difficult_rate = 0.6;
        }
        return {
          id: key,
          ...trackingMap[key],
          accuracy: Number(trackingMap[key].accuracy),
        };
      })
      .filter((item) => {
        return item !== null;
      });
    const dataUpdate = data.map((item) => {
      const length = data.length;
      return {
        ...item,
        timeMinutes: timeMinutes / length,
      };
    });
    setResults(dataUpdate);
    try {
      const { data: rs } = await instance.post(
        endpoint.learningFlashcard.updateLearningSession,
        dataUpdate
      );
      console.log(dataUpdate);
      setResults(dataUpdate);
    } catch (error) {
      handleErrorWithToast(error);
    }
  };
  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
  };
  function SortableItem(props) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: props.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-4 bg-white border rounded-lg shadow-sm flex items-center justify-between cursor-move"
      >
        <span className="text-lg">{props.id}</span>
        <ArrowUpDown className="h-5 w-5 text-gray-400" />
      </div>
    );
  }
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
                {currentSlide.question()}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {currentSlide.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === option ? "default" : "outline"}
                    className={`w-full justify-start text-left text-lg py-6 ${
                      isCorrect && index === currentSlide.correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(index)}
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
        case "word-ordering":
          const handleOrderWordClick = (word) => {
            if (availableWords.includes(word)) {
              setOrderedWords([...orderedWords, word]);
              setAvailableWords(availableWords.filter((w) => w !== word));
            } else {
              setOrderedWords(orderedWords.filter((w) => w !== word));
              setAvailableWords([...availableWords, word]);
            }
          };

          return (
            <div className="space-y-6 w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
                Sắp xếp các từ để tạo thành câu đúng
              </h2>
              <div className="flex flex-wrap gap-2 mb-4 min-h-[50px]">
                <AnimatePresence>
                  {availableWords.map((word) => (
                    <motion.div
                      key={word}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge
                        className="text-lg  px-2 cursor-pointer text-primary bg-gray-100 border-gray-300 hover:bg-gray-200"
                        onClick={() => handleOrderWordClick(word)}
                        style={{
                          paddingY: "0.2rem",
                        }}
                      >
                        {word}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg min-h-[100px] flex flex-wrap gap-2 items-start">
                <AnimatePresence>
                  {orderedWords.map((word) => (
                    <motion.div
                      key={word}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge
                        variant="default"
                        className="text-lg  px-2 cursor-pointer"
                        onClick={() => handleOrderWordClick(word)}
                        style={{
                          paddingY: "0.2rem",
                        }}
                      >
                        {word}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleAnswerSubmit}
                  className="w-full text-lg py-6 mt-4"
                >
                  Kiểm tra
                </Button>
                <Button
                  onClick={handleShowAnswer}
                  variant="outline"
                  className="w-full text-lg py-6 mt-4"
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
                  Đáp án: {currentSlide.sentence}
                </p>
              )}
            </div>
          );
        case "fill-in-blank":
          return (
            <div className="space-y-6 w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
                Điền từ còn thiếu vào chỗ trống
              </h2>
              <p className="text-xl text-center mb-6">
                {currentSlide.sentence}
              </p>
              <Input
                type="text"
                placeholder="Nhập từ còn thiếu"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-center text-xl py-6"
              />
              <Button
                onClick={handleAnswerSubmit}
                className="w-full text-lg py-6"
              >
                Kiểm tra
              </Button>
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
            </div>
          );
        case "matching":
          const handleWordClick = (id, pairIndex, isVietnamese) => {
            if (!selectedWord) {
              setSelectedWord({ id, isVietnamese, pairIndex });
            } else {
              if (selectedWord.isVietnamese !== isVietnamese) {
                if (pairIndex === selectedWord.pairIndex) {
                  handleAccuracyWhenCorrect(selectedWord.id);
                  setFirstTimeCheck(true);
                  const updatedVietnamese = matchedPairs[0].map((p) =>
                    p.pairIndex === pairIndex ? { ...p, isMatched: true } : p
                  );
                  const updatedEnglish = matchedPairs[1].map((p) =>
                    p.pairIndex === pairIndex ? { ...p, isMatched: true } : p
                  );
                  setMatchedPairs([updatedVietnamese, updatedEnglish]);
                } else {
                  handleAccuracyWhenWrong(selectedWord.id);
                  setFirstTimeCheck(true);
                }
              }
              setSelectedWord(null);
            }
          };

          return (
            <div className="space-y-6 w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
                Ghép từ tiếng Việt với nghĩa tiếng Anh
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {matchedPairs.length === 2 &&
                  matchedPairs[0].length > 0 &&
                  matchedPairs[1].length > 0 && (
                    <>
                      <div className="flex flex-col gap-2">
                        {matchedPairs[0].map((item, index) => (
                          <React.Fragment key={index}>
                            <Button
                              variant="outline"
                              className={`text-lg py-6 ${
                                item.isMatched
                                  ? "bg-green-200"
                                  : selectedWord?.pairIndex ===
                                      item.pairIndex &&
                                    selectedWord?.isVietnamese
                                  ? "bg-blue-100"
                                  : ""
                              }`}
                              onClick={() =>
                                !item.isMatched &&
                                handleWordClick(item.id, item.pairIndex, true)
                              }
                            >
                              {item.word}
                            </Button>
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        {matchedPairs[1].map((item, index) => (
                          <React.Fragment key={index}>
                            <Button
                              variant="outline"
                              className={`text-lg py-6 ${
                                item.isMatched
                                  ? "bg-green-200"
                                  : selectedWord?.pairIndex ===
                                      item.pairIndex &&
                                    !selectedWord?.isVietnamese
                                  ? "bg-blue-100"
                                  : ""
                              }`}
                              onClick={() =>
                                !item.isMatched &&
                                handleWordClick(item.id, item.pairIndex, false)
                              }
                            >
                              {item.word}
                            </Button>
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  )}
              </div>
              {isCorrect && (
                <div className="flex items-center justify-center text-xl text-green-500">
                  <Check className="mr-2 h-6 w-6" />
                  Chính xác! Bạn đã ghép đúng tất cả các cặp từ.
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
    }
  };
  useEffect(() => {
    resetUserInputs();
    if (currentSlide?.type === "word-ordering") {
      setOrderedWords([]);
      setAvailableWords(currentSlide.jumbledSentences);
    }
    if (currentSlide?.type === "matching") {
      setMatchedPairs(currentSlide.jumbledPairs);
    }
  }, [currentIndex]);
  useEffect(() => {}, [trackingMap]);
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
      learningFlashcardData.forEach((item) => {
        opt[item.id] = {
          word: item.flashcardId.word,
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
      const learningSetData = await getLearningSetData(endpoint, id);
      const learningFlashcardData = await getLearningFlashcardData(
        endpoint,
        learningSetData.id
      );
      setLearningFlashcardData(sortFlashcard(learningFlashcardData));
    }

    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4 mt-[-30px]">
      {results.length > 0 ? (
        <div className="w-full mt-[-100px]">
          <WordResultsCard id={id} results={results} />
        </div>
      ) : (
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
                  <div className="w-full h-full flex flex-col items-center overflow-y-auto">
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
      )}
    </div>
  );
}
