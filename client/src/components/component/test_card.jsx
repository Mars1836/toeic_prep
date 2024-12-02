"use client";
import { useEffect, useState } from "react";
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
  Repeat1,
  History,
} from "lucide-react";
import instance from "~configs/axios.instance";
import { endpoint } from "~consts";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "~helper";

export function ExamCard({ card, isTaken }) {
  const router = useRouter();
  function goToPracticeTest() {
    router.push(`/test3/${card.id}/practice-set`);
  }
  const getAttempts = () => {
    if (!card?.attempts?.length) {
      return 0;
    }
    return card.attempts.reduce((acc, curr) => {
      return acc + curr.times;
    }, 0);
  };
  useEffect(() => {
    if (card) {
      router.prefetch(`/test3/${card.id}/practice-set`);
    }
  }, [card]);
  return (
    <Card className="relative flex h-full flex-col bg-white">
      {card?.userAttempt && (
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
            {card.duration ?? 100}
          </Badge>
          <Badge variant="primary" className="text-xs">
            <BookOpen className="mr-1 h-3 w-3" />
            {card.numberOfQuestions} questions
          </Badge>
          <Badge variant="primary" className="text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            {getAttempts()} attempts
          </Badge>
          <Badge variant="primary" className="text-xs">
            <MessageSquare className="mr-1 h-3 w-3" />
            {card.comments ?? 0} comments
          </Badge>
          <Badge variant="primary" className="text-xs">
            <Layers className="mr-1 h-3 w-3" />
            {card.numberOfParts} parts
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <p className="p-2 font-semibold text-sm">#{card.type}</p>
        </div>
        <div className="mt-4 space-y-2">
          {card?.userAttempt ? (
            <div className="text-sm font-medium bg-green-200 text-green-800 p-2 rounded-md flex items-center justify-between">
              <span>Đã nộp {card.userAttempt?.timeSubmit} lần</span>
              <div className="flex items-center text-green-700">
                <History className="w-4 h-4 mr-1" />
                <span>
                  {formatTimeAgo(new Date(card.userAttempt?.lastSubmit))}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm font-medium bg-gray-200 text-gray-800 p-2 rounded-md flex items-center justify-between">
              <span>Manage your time effectively !</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className={
            card?.userAttempt
              ? "w-full bg-green-500 border text-white"
              : "w-full"
          }
          // variant={}
          onClick={() => {
            goToPracticeTest();
          }}
        >
          {card?.userAttempt ? "Retake Test" : "Take Test"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TestCardList() {
  const [takenTests, setTakenTests] = useState(new Set());
  const [testData, setTestData] = useState([]);
  const handleTakeTest = (id) => {
    setTakenTests((prev) => new Set(prev).add(id));
  };

  const handleViewResults = (id) => {
    alert(`Viewing results for ${id} test`);
    // Trong ứng dụng thực tế, bạn sẽ điều hướng đến trang kết quả hoặc mở modal ở đây
  };
  useEffect(() => {
    async function fetchData() {
      const { data } = await instance.get(endpoint.test.getByQuery);
      if (data) {
        setTestData(data);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">
        TOEIC Exam Sections
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {testData.map((card) => (
          <ExamCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
