"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ScoreAnalysis from "@/components/component/profile_score_analysis";
import PartAccuracy from "@/components/component/profile_part_accuracy";
import CategoryPerformance from "@/components/component/profile_category_performance";
import TimeAnalysis from "@/components/component/profile_time_analysis";
import CustomRecommendations from "@/components/component/profile_custom_recommendation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import instance from "~configs/axios.instance";
import { Loader2 } from "lucide-react";
import { handleErrorWithToast } from "~helper";
import { CategoryAccuracyChart } from "@/components/component/profile_category_accuracy";
import { RefreshCw, Lock } from "lucide-react";
import withAuth from "~HOC/withAuth";
import { useRouter } from "next/navigation";

function Dashboard() {
  const { endpoint } = useEndpoint();
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
  const [loadingData, setLoadingData] = useState(true);
  const isUpgraded = useSelector((state) => state.user.data.isUpgraded);
  const router = useRouter();
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

  const goToUpgrade = () => {
    router.push("/upgrade");
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

        if (recommendData?.content) {
          setRecommend(recommendData.content);
        }
      } catch (error) {
        handleErrorWithToast(error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDataAnalysis();
  }, []);

  return loadingData ? (
    <div className="flex justify-center items-center w-full mt-10">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        TOEIC Performance Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6  md:grid-cols-2 lg:grid-cols-3 mt-6">
        <div className=" lg:col-span-1  sm:col-span-3 col-span-3">
          <ScoreAnalysis
            score={score}
            readScore={readScore}
            listenScore={listenScore}
          />
        </div>
        <div className="lg:col-span-1 md:col-span-2 sm:col-span-3 col-span-3">
          <PartAccuracy timeRange={timeRange} accuracyByPart={accuracyByPart} />
        </div>
        <div className="lg:col-span-1 md:col-span-2 sm:col-span-3 col-span-3">
          <TimeAnalysis
            timeSecondRecommend={timeSecondRecommend}
            averageTimeByPart={averageTimeByPart}
          />
        </div>
        <div className="col-span-3">
          <CategoryAccuracyChart categoryAccuracy={categoryAccuracy} />
        </div>
        <div className="col-span-3">
          {isUpgraded ? (
            <Button
              onClick={handleGenerateNewSuggestions}
              disabled={isGenerating}
              variant="outline"
              className="my-4"
            >
              <RefreshCw
                className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
              />
              {isGenerating ? "Đang tạo..." : "Tạo đề xuất mới"}
            </Button>
          ) : (
            <>
              <Button
                variant="link"
                className="text-blue-500 my-4"
                onClick={goToUpgrade}
              >
                Nâng cấp để sử dụng
              </Button>
              <Button
                className="bg-gray-200 text-gray-500 cursor-not-allowed"
                disabled
              >
                <Lock className="mr-2 h-4 w-4" />
                Tạo lời giải bằng AI
              </Button>
            </>
          )}
        </div>
      </div>
      <CustomRecommendations recommend={recommend} />
    </div>
  );
}

export default withAuth(Dashboard);
