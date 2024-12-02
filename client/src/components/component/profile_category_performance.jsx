"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function CategoryPerformance({ timeRange }) {
  // Giả sử dữ liệu này sẽ được  lấy từ API dựa trên timeRange
  const data = [
    { category: "Chi tiết", accuracy: 80 },
    { category: "Suy luận", accuracy: 65 },
    { category: "Từ vựng", accuracy: 90 },
    { category: "Tình huống thực tế", accuracy: 75 },
    { category: "Ý chính", accuracy: 85 },
    { category: "Kết nối ý tưởng", accuracy: 70 },
    { category: "Giọng điệu và Mục đích", accuracy: 60 },
    { category: "Hoàn thành văn bản", accuracy: 80 },
    { category: "Ngữ pháp", accuracy: 85 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Hiệu suất theo Danh mục
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
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: "#333", fontSize: 12 }}
            />
            <Radar
              name="Độ chính xác"
              dataKey="accuracy"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
