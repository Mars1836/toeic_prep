"use client";
import { AlertCircle, ArrowLeft, Eye, Zap, Clock, CheckCircle, XCircle, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DynamicToeicResults({
  parts = [1, 4],
  totalQuestions = 36,
  answeredQuestions = 1,
  correctAnswers = 1,
  completionTime = "00:00:05"
}) {
  const [showAlert, setShowAlert] = useState(true)
  const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0
  const progressPercentage = (answeredQuestions / totalQuestions) * 100

  const renderParts = () => {
    if (parts.length === 1) return `Part ${parts[0]}`
    if (parts.length === 2) return `Part ${parts[0]} & ${parts[1]}`
    return `Parts ${parts.join(", ")}`;
  }

  return (
    (<div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {showAlert && (
          <Alert
            className="bg-green-100 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100 animate-fade-in-down">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between w-full">
              <span>
                Bạn có thể tạo flashcards từ các điểm đã highlight trong phần kết quả chi tiết.{" "}
                <Link
                  href="#"
                  className="font-medium underline underline-offset-4 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  Xem hướng dẫn
                </Link>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAlert(false)}
                className="text-green-800 dark:text-green-100 hover:text-green-600 dark:hover:text-green-400">
                &times;
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Kết quả Practice Set 2023</h1>
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">TOEIC Test 9 - {renderParts()}</h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="outline"
            className="group transition-all duration-300 ease-in-out transform hover:scale-105">
            <Eye className="mr-2 h-4 w-4 group-hover:animate-pulse" /> Xem đáp án
          </Button>
          <Button
            variant="outline"
            className="group transition-all duration-300 ease-in-out transform hover:scale-105">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-bounce-left" /> Quay về trang đề thi
          </Button>
        </div>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800 dark:text-white">Kết quả chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultItem
                icon={Zap}
                label="Kết quả làm bài"
                value={`${answeredQuestions}/${totalQuestions} câu hỏi đã được trả lời`} />
              <ResultItem
                icon={CheckCircle}
                label="Độ chính xác"
                value={`${accuracy.toFixed(1)}% (${correctAnswers}/${answeredQuestions} câu)`} />
              <ResultItem icon={Clock} label="Thời gian hoàn thành" value={completionTime} />
              <ResultItem
                icon={CheckCircle}
                label="Trả lời đúng"
                value={`${correctAnswers} câu`}
                valueColor="text-green-600 dark:text-green-400" />
              <ResultItem
                icon={XCircle}
                label="Trả lời sai"
                value={`${answeredQuestions - correctAnswers} câu`}
                valueColor="text-red-600 dark:text-red-400" />
              <ResultItem
                icon={HelpCircle}
                label="Bỏ qua"
                value={`${totalQuestions - answeredQuestions} câu`}
                valueColor="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tiến độ hoàn thành</p>
              <Progress value={progressPercentage} className="w-full h-2" />
              <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                {answeredQuestions}/{totalQuestions} câu ({progressPercentage.toFixed(1)}%)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}

function ResultItem({ icon: Icon, label, value, valueColor = "text-gray-800 dark:text-white" }) {
  return (
    (<div
      className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>)
  );
}