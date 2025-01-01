"use client";

import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import instance from "~configs/axios.instance";
import { useRouter } from "next/navigation";
import { convertSeconds } from "~helper";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { Loader2 } from "lucide-react";
export default function Component({ params }) {
  const { endpoint } = useEndpoint();
  const [showAlert, setShowAlert] = useState(true);
  const [resultData, setResultData] = useState();
  const [resultItems, setResultItems] = useState();
  const [testData, setTestData] = useState("");
  const [loadingResult, setLoadingResult] = useState(true);
  const rsId = params.rsId;
  const router = useRouter();
  const renderParts = () => {
    if (resultData.parts.length === 1) return `Part ${resultData.parts[0]}`;
    if (resultData.parts.length === 2)
      return `Part ${resultData.parts[0]} & ${resultData.parts[1]}`;
    return `Parts ${resultData.parts.join(", ")}`;
  };
  function goToDetail() {
    router.push(rsId + "/detail");
  }
  useEffect(() => {
    async function fetchResultData() {
      const { data } = await instance.get(endpoint.result.getResultById, {
        params: { id: rsId },
      });
      const { data: testData } = await instance.get(endpoint.test.getById, {
        params: { id: data.testId },
      });
      console.log(testData);
      console.log(data);
      setResultData(data);
      setTestData(testData);
      const { data: itemDatas } = await instance.get(
        endpoint.resultItem.getResultItemByResult,
        {
          params: { resultId: rsId },
        }
      );
      setResultItems(itemDatas);
      setLoadingResult(false);
    }
    fetchResultData();
  }, []);
  useEffect(() => {
    if (resultData) {
      router.prefetch(rsId + "/detail");
    }
  }, [resultData]);
  return loadingResult ? (
    <div className="flex justify-center items-center w-full mt-10">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    resultData && (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white  p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 ">Kết quả</h1>
            <h2 className="text-xl font-semibold text-blue-600 ">
              {testData?.title} - {renderParts()}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              className="group transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={goToDetail}
            >
              <Eye className="mr-2 h-4 w-4 group-hover:animate-pulse" /> Xem đáp
              án
            </Button>
            <Button
              variant="outline"
              className="group transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-bounce-left" />{" "}
              Quay về trang home
            </Button>
          </div>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-800 ">
                Kết quả chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultItem
                  icon={Zap}
                  label="Kết quả làm bài"
                  value={`${resultData.numberOfUserAnswers}/${resultData.numberOfQuestions} câu hỏi đã được trả lời`}
                />
                <ResultItem
                  icon={CheckCircle}
                  label="Độ chính xác"
                  value={`${(
                    (resultData?.numberOfCorrectAnswers /
                      resultData?.numberOfUserAnswers) *
                    100
                  ).toFixed(1)}% (${resultData.numberOfCorrectAnswers}/${
                    resultData.numberOfUserAnswers
                  } câu)`}
                />
                <ResultItem
                  icon={Clock}
                  label="Thời gian hoàn thành"
                  value={convertSeconds(resultData.secondTime)}
                />
                <ResultItem
                  icon={CheckCircle}
                  label="Trả lời đúng"
                  value={`${resultData.numberOfCorrectAnswers} câu`}
                  valueColor="text-green-600 "
                />
                <ResultItem
                  icon={XCircle}
                  label="Trả lời sai"
                  value={`${
                    resultData.numberOfUserAnswers -
                    resultData.numberOfCorrectAnswers
                  } câu`}
                  valueColor="text-red-600 "
                />
                <ResultItem
                  icon={HelpCircle}
                  label="Bỏ qua"
                  value={`${
                    resultData.numberOfQuestions -
                    resultData.numberOfUserAnswers
                  } câu`}
                  valueColor="text-yellow-600 "
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  );
}

function ResultItem({
  icon: Icon,
  label,
  value,
  valueColor = "text-gray-800 ",
}) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white  rounded-lg shadow transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className="h-8 w-8 text-blue-500 " />
      <div>
        <p className="text-sm font-medium text-gray-500 ">{label}</p>
        <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}
