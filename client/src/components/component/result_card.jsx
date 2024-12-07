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
import { endpoint } from "~consts";
import { useEffect, useState } from "react";
import { convertSeconds, formatDate } from "../../helper";
import instance from "~configs/axios.instance";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

function ExamResultCard({ result, onViewDetails }) {
  const router = useRouter();
  useEffect(() => {
    if (result) {
      router.prefetch(`/test3/${result.testId.id}/result/${result.id}`);
    }
  }, [result]);
  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {result.testId.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <CalendarDays className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{formatDate(result.createdAt)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{convertSeconds(result.secondTime)}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 bg-white">
          <div className="bg-muted flex flex-col items-center rounded-lg p-2">
            <CheckCircle className="mb-1 h-5 w-5 text-green-500" />
            <span className="text-muted-foreground text-xs">Correct</span>
            <span className="font-semibold">
              {result.numberOfCorrectAnswers}
            </span>
          </div>
          <div className="bg-muted flex flex-col items-center rounded-lg p-2">
            <PenTool className="mb-1 h-5 w-5 text-blue-500" />
            <span className="text-muted-foreground text-xs">Attempted</span>
            <span className="font-semibold">{result.numberOfUserAnswers}</span>
          </div>
          <div className="bg-muted flex flex-col items-center rounded-lg p-2">
            <HelpCircle className="mb-1 h-5 w-5 text-orange-500" />
            <span className="text-muted-foreground text-xs">Total</span>
            <span className="font-semibold">{result.numberOfQuestions}</span>
          </div>
        </div>
        <Button
          onClick={() => onViewDetails(result.testId.id, result.id)}
          className="w-full"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ResultCardList() {
  const [userResults, setUserResults] = useState();
  const user = useSelector((state) => state.user.data);

  const router = useRouter();
  useEffect(() => {
    if (!user) {
      return;
    }
    async function fetchResultData() {
      try {
        const { data } = await instance.get(endpoint.result.getResultByUser);
        setUserResults(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchResultData();
  }, [user]);
  const handleViewDetails = (idTest, idResult) => {
    router.push(`/test3/${idTest}/result/${idResult}`);
  };

  return (
    userResults && (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Your Exam Results
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userResults.map((result) => (
            <ExamResultCard
              key={result.id}
              result={result}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    )
  );
}
