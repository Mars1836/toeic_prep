"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  BookOpen,
  MessageSquare,
  Layers,
  CheckCircle,
} from "lucide-react";

const examCards = [
  {
    id: "listening",
    title: "TOEIC Listening",
    description: "Test your English listening skills",
    duration: "45 min",
    questions: 100,
    comments: 24,
    parts: 4,
  },
  {
    id: "reading",
    title: "TOEIC Reading",
    description: "Assess your English reading comprehension",
    duration: "75 min",
    questions: 100,
    comments: 32,
    parts: 3,
  },
  {
    id: "speaking",
    title: "TOEIC Speaking",
    description: "Evaluate your English speaking abilities",
    duration: "20 min",
    questions: 11,
    comments: 18,
    parts: 6,
  },
  {
    id: "writing",
    title: "TOEIC Writing",
    description: "Measure your English writing skills",
    duration: "60 min",
    questions: 8,
    comments: 22,
    parts: 2,
  },
];

function ExamCard({ card, isTaken, onTakeTest, onViewResults }) {
  return (
    <Card className="relative flex h-full flex-col bg-white">
      {isTaken && (
        <div
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500"
          aria-label="Completed"
        >
          <CheckCircle className="h-4 w-4 text-white" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
        <CardDescription>{card.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary" className="text-xs">
            <Clock className="mr-1 h-3 w-3" />
            {card.duration}
          </Badge>
          <Badge variant="primary" className="text-xs">
            <BookOpen className="mr-1 h-3 w-3" />
            {card.questions} questions
          </Badge>
          <Badge variant="primary" className="text-xs">
            <MessageSquare className="mr-1 h-3 w-3" />
            {card.comments} comments
          </Badge>
          <Badge variant="primary" className="text-xs">
            <Layers className="mr-1 h-3 w-3" />
            {card.parts} parts
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isTaken ? "outline" : "default"}
          onClick={isTaken ? onViewResults : onTakeTest}
        >
          {isTaken ? "View Results" : "Take Test"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TestCardList() {
  const [takenTests, setTakenTests] = useState(new Set());

  const handleTakeTest = (id) => {
    setTakenTests((prev) => new Set(prev).add(id));
  };

  const handleViewResults = (id) => {
    alert(`Viewing results for ${id} test`);
    // Trong ứng dụng thực tế, bạn sẽ điều hướng đến trang kết quả hoặc mở modal ở đây
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">
        TOEIC Exam Sections
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {examCards.map((card) => (
          <ExamCard
            key={card.id}
            card={card}
            isTaken={takenTests.has(card.id)}
            onTakeTest={() => handleTakeTest(card.id)}
            onViewResults={() => handleViewResults(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
