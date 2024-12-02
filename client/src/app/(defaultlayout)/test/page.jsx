"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const confidenceLevels = [
  { value: "1", label: "Không biết" },
  { value: "2", label: "Mới học" },
  { value: "3", label: "Đang học" },
  { value: "4", label: "Gần thuộc" },
  { value: "5", label: "Đã thuộc" },
];

const slides = [
  {
    type: "confidence",
    word: "Xin chào",
    meaning: "Hello",
    example: "Xin chào, bạn khỏe không?",
  },
  {
    type: "quiz",
    word: "Xin chào",
    meaning: "Hello",
    example: "Xin chào, bạn khỏe không?",
  },
  {
    type: "multiple-choice",
    word: "Xin chào",
    meaning: "Hello",
    options: ["Goodbye", "Thank you", "Hello", "How are you"],
  },
  { type: "writing", word: "Xin chào", meaning: "Hello" },
  {
    type: "word-ordering",
    sentence: "Xin chào bạn khỏe không",
    words: ["bạn", "khỏe", "không", "Xin", "chào"],
  },
  {
    type: "fill-in-blank",
    sentence: "Xin _____, bạn khỏe không?",
    answer: "chào",
  },
  {
    type: "matching",
    pairs: [
      { vietnamese: "Xin chào", english: "Hello" },
      { vietnamese: "Tạm biệt", english: "Goodbye" },
      { vietnamese: "Cảm ơn", english: "Thank you" },
      { vietnamese: "Không có chi", english: "You're welcome" },
    ],
  },
  {
    type: "confidence",
    word: "Cảm ơn",
    meaning: "Thank you",
    example: "Cảm ơn bạn rất nhiều.",
  },
  {
    type: "quiz",
    word: "Cảm ơn",
    meaning: "Thank you",
    example: "Cảm ơn bạn rất nhiều.",
  },
  {
    type: "multiple-choice",
    word: "Cảm ơn",
    meaning: "Thank you",
    options: ["Please", "You're welcome", "Thank you", "Sorry"],
  },
  { type: "writing", word: "Cảm ơn", meaning: "Thank you" },
];

const matchColors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-orange-200",
];

export default function FlashcardLearning() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userConfidence, setUserConfidence] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [orderedWords, setOrderedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const currentSlide = slides[currentIndex];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (startTime === null) {
      setStartTime(new Date());
    }
    resetUserInputs();
    if (currentSlide.type === "word-ordering") {
      setOrderedWords([]);
      setAvailableWords(currentSlide.words);
    }
    if (currentSlide.type === "matching") {
      const shuffledPairs = [...currentSlide.pairs]
        .map((pair) => ({ ...pair, matched: false, color: "" }))
        .sort(() => Math.random() - 0.5);
      setMatchedPairs(shuffledPairs);
    }
  }, [currentIndex]);

  const handleNext = () => {
    updateResults();
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetUserInputs = () => {
    setUserConfidence("");
    setUserAnswer("");
    setSelectedOption("");
    setIsCorrect(null);
    setShowAnswer(false);
    setSelectedWord(null);
  };

  const handleConfidenceChange = (value) => {
    setUserConfidence(value);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsCorrect(option === currentSlide.meaning);
  };

  const handleAnswerSubmit = () => {
    let isAnswerCorrect = false;
    if (currentSlide.type === "writing") {
      isAnswerCorrect =
        userAnswer.toLowerCase() === currentSlide.word.toLowerCase();
    } else if (currentSlide.type === "word-ordering") {
      isAnswerCorrect = orderedWords.join(" ") === currentSlide.sentence;
    } else if (currentSlide.type === "fill-in-blank") {
      isAnswerCorrect =
        userAnswer.toLowerCase() === currentSlide.answer.toLowerCase();
    }
    setIsCorrect(isAnswerCorrect);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const updateResults = () => {
    const newResults = slides.map((slide, index) => {
      let correct = false;
      let attempts = 0;
      switch (slide.type) {
        case "confidence":
          correct = results[index]?.correct || false;
          attempts = results[index]?.attempts || 0;
          break;
        case "quiz":
          correct = true;
          attempts = 1;
          break;
        case "multiple-choice":
          correct = selectedOption === slide.meaning;
          attempts = results[index]?.attempts || 1;
          break;
        case "writing":
          correct = userAnswer.toLowerCase() === slide.word.toLowerCase();
          attempts = results[index]?.attempts || 1;
          break;
        case "word-ordering":
          correct = orderedWords.join(" ") === slide.sentence;
          attempts = results[index]?.attempts || 1;
          break;
        case "fill-in-blank":
          correct = userAnswer.toLowerCase() === slide.answer.toLowerCase();
          attempts = results[index]?.attempts || 1;
          break;
        case "matching":
          correct = matchedPairs.every((pair) => pair.matched);
          attempts = results[index]?.attempts || 1;
          break;
      }
      return {
        word: slide.word,
        correct,
        attempts: attempts + 1,
        accuracy: correct ? 100 : results[index]?.accuracy || 0,
      };
    });
    setResults(newResults);
  };

  const handleSubmit = () => {
    updateResults();
    setEndTime(new Date());
    setShowResults(true);
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const renderSlideContent = () => {
    switch (currentSlide.type) {
      case "confidence":
        return (
          <div className="space-y-6 w-full max-w-2xl">
            <h2 className="text-4xl font-bold text-center mb-8 text-purple-700">
              {currentSlide.word}
            </h2>
            <p className="text-xl text-center mb-6 text-gray-600">
              Bạn đã thuộc từ này ở mức nào?
            </p>
            <RadioGroup
              value={userConfidence}
              onValueChange={handleConfidenceChange}
              className="grid grid-cols-1 gap-3"
            >
              {confidenceLevels.map((level) => (
                <Label
                  key={level.value}
                  htmlFor={`confidence-${level.value}`}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    userConfidence === level.value
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
            <h2 className="text-4xl font-bold text-center mb-8 text-purple-700">
              Chọn nghĩa đúng cho từ "{currentSlide.word}"
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
            <h2 className="text-4xl font-bold text-center mb-8 text-purple-700">
              Viết lại từ: {currentSlide.meaning}
            </h2>
            <Input
              type="text"
              placeholder="Nhập từ tiếng Việt"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center text-xl py-6"
            />
            <div className="flex space-x-4">
              <Button
                onClick={handleAnswerSubmit}
                className="flex-1 text-lg py-6"
              >
                Kiểm tra
              </Button>
              <Button
                onClick={handleShowAnswer}
                variant="outline"
                className="flex-1 text-lg py-6"
              >
                <Eye className="mr-2 h-5 w-5" /> Xem đáp án
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
        const handleWordClick = (word) => {
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
                      variant="secondary"
                      className="text-lg py-2 px-4 cursor-pointer"
                      onClick={() => handleWordClick(word)}
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
                      className="text-lg py-2 px-4 cursor-pointer"
                      onClick={() => handleWordClick(word)}
                    >
                      {word}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button
              onClick={handleAnswerSubmit}
              className="w-full text-lg py-6 mt-4"
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
      case "fill-in-blank":
        return (
          <div className="space-y-6 w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
              Điền từ còn thiếu vào chỗ trống
            </h2>
            <p className="text-xl text-center mb-6">{currentSlide.sentence}</p>
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
        const handleMatchingWordClick = (word, isVietnamese) => {
          if (!selectedWord) {
            setSelectedWord({ word, isVietnamese });
          } else {
            if (selectedWord.isVietnamese !== isVietnamese) {
              const pair = matchedPairs.find(
                (p) =>
                  (p.vietnamese === selectedWord.word && p.english === word) ||
                  (p.english === selectedWord.word && p.vietnamese === word)
              );
              if (pair) {
                const updatedPairs = matchedPairs.map((p) =>
                  p === pair
                    ? {
                        ...p,
                        matched: true,
                        color:
                          matchColors[
                            matchedPairs.filter((mp) => mp.matched).length
                          ],
                      }
                    : p
                );
                setMatchedPairs(updatedPairs);
                if (updatedPairs.every((p) => p.matched)) {
                  setIsCorrect(true);
                }
              }
            }
            setSelectedWord(null);
          }
        };

        const shuffledVietnamese = matchedPairs
          .map((pair) => pair.vietnamese)
          .sort(() => Math.random() - 0.5);
        const shuffledEnglish = matchedPairs
          .map((pair) => pair.english)
          .sort(() => Math.random() - 0.5);

        return (
          <div className="space-y-6 w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
              Ghép từ tiếng Việt với nghĩa tiếng Anh
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {shuffledVietnamese.map((word, index) => (
                <Button
                  key={`vn-${index}`}
                  variant="outline"
                  className={`text-lg py-4 ${
                    matchedPairs.find((p) => p.vietnamese === word)?.color ||
                    (selectedWord?.word === word ? "bg-blue-100" : "")
                  }`}
                  onClick={() =>
                    !matchedPairs.find((p) => p.vietnamese === word)?.matched &&
                    handleMatchingWordClick(word, true)
                  }
                >
                  {word}
                </Button>
              ))}
              {shuffledEnglish.map((word, index) => (
                <Button
                  key={`en-${index}`}
                  variant="outline"
                  className={`text-lg py-4 ${
                    matchedPairs.find((p) => p.english === word)?.color ||
                    (selectedWord?.word === word ? "bg-blue-100" : "")
                  }`}
                  onClick={() =>
                    !matchedPairs.find((p) => p.english === word)?.matched &&
                    handleMatchingWordClick(word, false)
                  }
                >
                  {word}
                </Button>
              ))}
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
  };

  const renderResults = () => {
    const totalTime = (endTime - startTime) / 1000; // in seconds
    const uniqueWords = [...new Set(results.map((r) => r.word))];
    const wordResults = uniqueWords.map((word) => {
      const wordFlashcards = results.filter((r) => r.word === word);
      const correctCount = wordFlashcards.filter((r) => r.correct).length;
      const accuracy = (correctCount / wordFlashcards.length) * 100;
      return { word, accuracy };
    });

    return (
      <div className="space-y-8 w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-center mb-8 text-purple-700">
          Kết quả
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-xl mb-2">
            Thời gian làm bài:{" "}
            <span className="font-semibold">{totalTime.toFixed(2)} giây</span>
          </p>
          <p className="text-xl">
            Tỉ lệ chính xác tổng thể:{" "}
            <span className="font-semibold">
              {(
                wordResults.reduce((sum, r) => sum + r.accuracy, 0) /
                wordResults.length
              ).toFixed(2)}
              %
            </span>
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {wordResults.map((result, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
            >
              <span className="text-lg font-medium">{result.word}</span>
              <span
                className={`text-lg font-semibold ${
                  result.accuracy >= 70
                    ? "text-green-600"
                    : result.accuracy >= 40
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {result.accuracy.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            setCurrentIndex(0);
            setResults([]);
            setShowResults(false);
            setStartTime(new Date());
            setEndTime(null);
          }}
          className="w-full text-lg py-6 mt-8 bg-purple-600 hover:bg-purple-700 text-white"
        >
          Làm lại bài học
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-4xl">
        {!showResults && (
          <>
            <Progress
              value={(currentIndex / (slides.length - 1)) * 100}
              className="mb-4"
            />
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
                      <Button
                        onClick={handleSubmit}
                        size="lg"
                        className="text-lg bg-green-500 hover:bg-green-600"
                      >
                        Nộp bài
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={currentIndex === slides.length - 1}
                        size="lg"
                        className="text-lg"
                      >
                        Tiếp theo <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </>
        )}
        {showResults && (
          <Card className="w-full shadow-lg">
            <CardContent className="p-8">{renderResults()}</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
