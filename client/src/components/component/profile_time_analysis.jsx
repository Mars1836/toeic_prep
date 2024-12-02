"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { part: "Part 1", userTime: 6, recommendedTime: 5 },
  { part: "Part 2", userTime: 5, recommendedTime: 5 },
  { part: "Part 3", userTime: 13, recommendedTime: 12 },
  { part: "Part 4", userTime: 10, recommendedTime: 10 },
  { part: "Part 5", userTime: 8, recommendedTime: 8 },
  { part: "Part 6", userTime: 12, recommendedTime: 11 },
  { part: "Part 7", userTime: 55, recommendedTime: 54 },
];
function formatData(averageTimeByPart, timeSecondRecommend) {
  const data = [];
  for (const [key, value] of Object.entries(averageTimeByPart)) {
    data.push({
      part: "Part " + key,
      userTime: Number(value),
      recommendedTime: timeSecondRecommend ? timeSecondRecommend[key] : 0,
    });
  }
  console.log(data);
  return data;
}
export default function TimeAnalysis({
  timeRange,
  averageTimeByPart,
  timeSecondRecommend,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Phân tích Thời gian (giây mỗi câu hỏi)
          <div className="text-sm text-gray-500">
            Với 4 part nên đầu làm theo bài nghe
          </div>
          {/* {timeRange === "week"
            ? "Tuần"
            : timeRange === "month"
            ? "Tháng"
            : "Năm"}
          ) */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formatData(averageTimeByPart, timeSecondRecommend)}>
            <XAxis dataKey="part" interval={1} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="userTime" fill="#8884d8" name="Your Time" />
            <Bar
              dataKey="recommendedTime"
              fill="#82ca9d"
              name="Recommended Time"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
