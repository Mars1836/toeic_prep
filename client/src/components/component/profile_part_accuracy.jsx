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
  { part: "Part 1", accuracy: 85 },
  { part: "Part 2", accuracy: 70 },
  { part: "Part 3", accuracy: 75 },
  { part: "Part 4", accuracy: 80 },
  { part: "Part 5", accuracy: 90 },
  { part: "Part 6", accuracy: 65 },
  { part: "Part 7", accuracy: 60 },
];
const formatData = (accuracyByPart) => {
  const data = [];
  for (const [key, value] of Object.entries(accuracyByPart)) {
    const item = {
      part: "Part " + key,
      accuracy: Number(value),
    };
    data.push(item);
  }
  return data;
};
export default function PartAccuracy({ timeRange, accuracyByPart }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Độ chính xác theo Phần(%)
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formatData(accuracyByPart)}>
            <XAxis dataKey="part" interval={1} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="accuracy" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
