import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export function WordResultsCard({ id, results }) {
  const router = useRouter();
  const totalTime = results.reduce(
    (sum, result) => sum + result.timeMinutes,
    0
  );
  const onReturnToFlashcards = () => {
    router.push(`/flashcards/studying/${id}/tracking`);
  };
  return (
    <Card className="w-full md:min-w-[500px] lg:min-w-[700px] max-w-2xl mx-auto sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Word Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-base sm:text-lg font-semibold">
            Total Time:
          </span>
          <span className="text-base sm:text-lg ml-2">
            {totalTime.toFixed(2)} minutes
          </span>
        </div>
        <ScrollArea className="h-[200px] sm:h-[250px] md:h-[300px] pr-4">
          {results.map((result) => (
            <div key={result.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm sm:text-base">
                  {result.word}
                </span>
                <span className="text-xs sm:text-sm">
                  {result.num_of_quiz === null
                    ? "N/A"
                    : `${result.num_of_quiz} quiz(zes)`}
                </span>
              </div>
              <div className="flex items-center">
                <Progress
                  value={result.accuracy * 100}
                  className="flex-grow mr-2 bg-gray-200"
                />
                <span className="text-xs sm:text-sm font-medium w-12 text-right">
                  {(result.accuracy * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onReturnToFlashcards}
          className="w-full text-sm sm:text-base"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Flashcards
        </Button>
      </CardFooter>
    </Card>
  );
}
