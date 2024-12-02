"use client";

import { useState } from "react";
import ScoreAnalysis from "@/components/component/profile_score_analysis";
import PartAccuracy from "@/components/component/profile_part_accuracy";
import CategoryPerformance from "@/components/component/profile_category_performance";
import TimeAnalysis from "@/components/component/profile_time_analysis";
import CustomRecommendations from "@/components/component/profile_custom_recommendation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { endpoint } from "@/consts";
import { useEffect } from "react";
import instance from "~configs/axios.instance";
import { handleErrorWithToast } from "~helper";
import { CategoryAccuracyChart } from "@/components/component/profile_category_accuracy";
//type TimeRange = 'week' | 'month' | 'year'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [accuracyByPart, setAccuracyByPart] = useState([]);
  const [averageTimeByPart, setAverageTimeByPart] = useState([]);
  const [categoryAccuracy, setCategoryAccuracy] = useState([]);
  const [timeSecondRecommend, setTimeSecondRecommend] = useState({});
  const [score, setScore] = useState(0);
  const [readScore, setReadScore] = useState(0);
  const [listenScore, setListenScore] = useState(0);
  // const handleRangeChange = (range) => {
  //   setTimeRange(range);
  //   // Ở đây bạn sẽ cần gọi API hoặc cập nhật state để lấy dữ liệu mới cho khoảng thời gian đã chọn
  // };
  useEffect(() => {
    const fetchDataAnalysis = async () => {
      try {
        const { data } = await instance.get(endpoint.profile.getAnalysis);
        if (!data) return;
        setAccuracyByPart(data.accuracyByPart);
        setAverageTimeByPart(data.averageTimeByPart);
        setCategoryAccuracy(data.categoryAccuracy);
        setReadScore(data.readScore);
        setListenScore(data.listenScore);
        setScore(data.score);
        setTimeSecondRecommend(data.timeSecondRecommend);
      } catch (error) {
        handleErrorWithToast(error);
      }
    };
    fetchDataAnalysis();
  }, []);
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        TOEIC Performance Dashboard
      </h1>
      {/* <Card>
        <CardContent className="flex justify-center space-x-2 p-4">
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => handleRangeChange("week")}
          >
            Tuần
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => handleRangeChange("month")}
          >
            Tháng
          </Button>
          <Button
            variant={timeRange === "year" ? "default" : "outline"}
            onClick={() => handleRangeChange("year")}
          >
            Năm
          </Button>
        </CardContent>
      </Card> */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        <ScoreAnalysis
          // timeRange={timeRange}
          score={score}
          readScore={readScore}
          listenScore={listenScore}
        />
        <PartAccuracy timeRange={timeRange} accuracyByPart={accuracyByPart} />
        <TimeAnalysis
          // timeRange={timeRange}
          timeSecondRecommend={timeSecondRecommend}
          averageTimeByPart={averageTimeByPart}
        />
        <div className="col-span-3">
          <CategoryAccuracyChart
            categoryAccuracy={categoryAccuracy}
            // timeRange={timeRange}
          />
        </div>
        <div className="col-span-3">
          <CustomRecommendations />
        </div>
      </div>
    </div>
  );
}
