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
import { RefreshCw } from "lucide-react";
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
  const [recommend, setRecommend] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  // const handleRangeChange = (range) => {
  //   setTimeRange(range);
  //   // Ở đây bạn sẽ cần gọi API hoặc cập nhật state để lấy dữ liệu mới cho khoảng thời gian đã chọn
  // };
  const handleGenerateNewSuggestions = async () => {
    setIsGenerating(true);
    try {
      const { data } = await instance.post(endpoint.aichat.getRecommend);
      setRecommend(data);
    } catch (error) {
      handleErrorWithToast(error);
    } finally {
      setIsGenerating(false);
    }
  };
  useEffect(() => {
    const fetchDataAnalysis = async () => {
      try {
        const { data } = await instance.get(endpoint.profile.getAnalysis);
        const { data: recommendData } = await instance.get(
          endpoint.profile.getRecommend
        );
        if (!data) return;
        setAccuracyByPart(data.accuracyByPart);
        setAverageTimeByPart(data.averageTimeByPart);
        setCategoryAccuracy(data.categoryAccuracy);
        setReadScore(data.readScore);
        setListenScore(data.listenScore);
        setScore(data.score);
        setTimeSecondRecommend(data.timeSecondRecommend);
        setRecommend(recommendData.content);
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
          <Button
            onClick={handleGenerateNewSuggestions}
            disabled={isGenerating}
            variant="outline"
            className="mb-4"
          >
            <RefreshCw
              className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
            />
            {isGenerating ? "Đang tạo..." : "Tạo đề xuất mới"}
          </Button>
          <CustomRecommendations recommend={recommend} />
        </div>
      </div>
    </div>
  );
}
