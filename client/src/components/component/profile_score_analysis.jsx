"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ScoreAnalysis({
  timeRange,
  score,
  readScore,
  listenScore,
}) {
  // This would typically come from an API or state management

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          Phân tích Điểm số
          {/* (
          {timeRange === "week"
            ? "Tuần"
            : timeRange === "month"
            ? "Tháng"
            : "Năm"}
          ) */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Overall Score
              </span>
              <span className="text-sm font-medium text-gray-700">
                {score}/990
              </span>
            </div>
            <Progress
              value={(score / 990) * 100}
              className="w-full bg-gray-200"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Listening
              </span>
              <span className="text-sm font-medium text-gray-700">
                {listenScore}/495
              </span>
            </div>
            <Progress
              value={(listenScore / 495) * 100}
              className="w-full bg-gray-200"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 ">
                Reading
              </span>
              <span className="text-sm font-medium text-gray-700">
                {readScore}/495
              </span>
            </div>
            <Progress
              value={(readScore / 495) * 100}
              className="w-full bg-gray-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
