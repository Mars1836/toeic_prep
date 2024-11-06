"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  PenTool,
  HelpCircle,
} from "lucide-react";
import { Button } from "~components/ui/button";

function ExamResultCard({ result, onViewDetails }) {
  const percentageCorrect = Math.round(
    (result.correctAnswers / result.totalQuestions) * 100
  );

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{result.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <CalendarDays className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{result.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{result.duration}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 bg-white">
          <div className="bg-muted flex flex-col items-center rounded-lg p-2">
            <CheckCircle className="mb-1 h-5 w-5 text-green-500" />
            <span className="text-muted-foreground text-xs">Correct</span>
            <span className="font-semibold">{result.correctAnswers}</span>
          </div>
          <div className="bg-muted flex flex-col items-center rounded-lg p-2">
            <PenTool className="mb-1 h-5 w-5 text-blue-500" />
            <span className="text-muted-foreground text-xs">Attempted</span>
            <span className="font-semibold">{result.attemptedQuestions}</span>
          </div>
          <div className="bg-muted flex flex-col items-center rounded-lg p-2">
            <HelpCircle className="mb-1 h-5 w-5 text-orange-500" />
            <span className="text-muted-foreground text-xs">Total</span>
            <span className="font-semibold">{result.totalQuestions}</span>
          </div>
        </div>
        <Button onClick={() => onViewDetails(result.id)} className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ResultCardList() {
  const examResults = [
    {
      id: "1",
      title: "TOEIC Listening and Reading",
      date: "2024-03-15",
      duration: "2 hours",
      correctAnswers: 180,
      attemptedQuestions: 195,
      totalQuestions: 200,
    },
    {
      id: "2",
      title: "TOEIC Speaking",
      date: "2024-03-20",
      duration: "20 minutes",
      correctAnswers: 160,
      attemptedQuestions: 170,
      totalQuestions: 200,
    },
    {
      id: "3",
      title: "TOEIC Writing",
      date: "2024-03-25",
      duration: "60 minutes",
      correctAnswers: 140,
      attemptedQuestions: 150,
      totalQuestions: 200,
    },
  ];
  const handleViewDetails = (id) => {
    console.log(`Viewing details for exam with id: ${id}`);
    // In a real application, you would navigate to a details page or open a modal here
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Your Exam Results</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examResults.map((result) => (
          <ExamResultCard
            key={result.id}
            result={result}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
