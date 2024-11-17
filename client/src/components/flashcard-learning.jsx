"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  ArrowUpDown,
} from "lucide-react";
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
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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

export function FlashcardLearningComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userConfidence, setUserConfidence] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [orderedWords, setOrderedWords] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // Moved here

  const currentSlide = slides[currentIndex];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    resetUserInputs();
    if (currentSlide.type === "word-ordering") {
      setOrderedWords(currentSlide.words);
    }
    if (currentSlide.type === "matching") {
      setMatchedPairs(
        currentSlide.pairs.map((pair) => ({ ...pair, matched: false }))
      );
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Bạn đã hoàn thành bài học!");
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
        const handleDragEnd = (event) => {
          const { active, over } = event;
          if (active.id !== over.id) {
            setOrderedWords((items) => {
              const oldIndex = items.indexOf(active.id);
              const newIndex = items.indexOf(over.id);
              return arrayMove(items, oldIndex, newIndex);
            });
          }
        };

        return (
          <div className="space-y-6 w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
              Sắp xếp các từ để tạo thành câu đúng
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedWords}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {orderedWords.map((word) => (
                    <SortableItem key={word} id={word} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
        const handleWordClick = (word, isVietnamese) => {
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
                  p === pair ? { ...p, matched: true } : p
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

        return (
          <div className="space-y-6 w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
              Ghép từ tiếng Việt với nghĩa tiếng Anh
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {matchedPairs.map((pair, index) => (
                <React.Fragment key={index}>
                  <Button
                    variant="outline"
                    className={`text-lg py-4 ${
                      pair.matched
                        ? "bg-green-100"
                        : selectedWord?.word === pair.vietnamese
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() =>
                      !pair.matched && handleWordClick(pair.vietnamese, true)
                    }
                  >
                    {pair.vietnamese}
                  </Button>
                  <Button
                    variant="outline"
                    className={`text-lg py-4 ${
                      pair.matched
                        ? "bg-green-100"
                        : selectedWord?.word === pair.english
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() =>
                      !pair.matched && handleWordClick(pair.english, false)
                    }
                  >
                    {pair.english}
                  </Button>
                </React.Fragment>
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-4xl">
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
      </div>
    </div>
  );
}
