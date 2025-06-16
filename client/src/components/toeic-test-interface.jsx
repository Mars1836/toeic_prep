"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Calendar, Users, Clock, Trophy } from "lucide-react";

const toeicParts = [
  { id: 1, name: "Photographs", questions: 6 },
  { id: 2, name: "Question-Response", questions: 25 },
  { id: 3, name: "Conversations", questions: 39 },
  { id: 4, name: "Short Talks", questions: 30 },
  { id: 5, name: "Incomplete Sentences", questions: 30 },
  { id: 6, name: "Text Completion", questions: 16 },
  { id: 7, name: "Reading Comprehension", questions: 54 },
];

const timeLimits = [
  { value: "0", label: "Không giới hạn" },
  { value: "30", label: "30 phút" },
  { value: "60", label: "1 giờ" },
  { value: "90", label: "1 giờ 30 phút" },
  { value: "120", label: "2 giờ" },
];

const leaderboard = [
  { rank: 1, name: "Nguyễn Văn A", score: 950 },
  { rank: 2, name: "Trần Thị B", score: 925 },
  { rank: 3, name: "Lê Văn C", score: 900 },
  { rank: 4, name: "Phạm Thị D", score: 875 },
  { rank: 5, name: "Hoàng Văn E", score: 850 },
];

export function ToeicTestInterface() {
  const [selectedParts, setSelectedParts] = React.useState([]);
  const [timeLimit, setTimeLimit] = React.useState("0");

  const togglePart = (partId) => {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  const startPractice = () => {
    console.log(
      "Starting practice with parts:",
      selectedParts,
      "Time limit:",
      timeLimit
    );
    // Here you would typically navigate to the practice page with the selected parts and time limit
  };

  const startRealTest = () => {
    console.log("Starting real test");
    // Here you would typically navigate to the full test page
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <img src="/placeholder.svg" alt="STUDY4" className="h-8" />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium">
                Chương trình học
              </a>
              <a href="#" className="text-sm font-medium">
                Đề thi online
              </a>
              <a href="/register-test" className="text-sm font-medium">
                Đăng kí thi
              </a>
              <a href="#" className="text-sm font-medium">
                Flashcards
              </a>
              <a href="#" className="text-sm font-medium">
                Blog
              </a>
              <a href="#" className="text-sm font-medium">
                Kích hoạt tài khoản
              </a>
              <Button variant="default">Đăng nhập</Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">
                Practice Set 2023 TOEIC Test 9
              </h1>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  1,234 lượt làm
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  56 bình luận
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Cập nhật 12/12/2023
                </span>
              </div>
            </div>

            <div className="bg-red-500 text-white p-3 text-center rounded-md mb-6">
              ÔN ĐỂ THI FULL TEST
            </div>

            <Tabs defaultValue="practice">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="practice">Luyện tập</TabsTrigger>
                <TabsTrigger value="real">Thực chiến</TabsTrigger>
              </TabsList>
              <TabsContent value="practice">
                <Card>
                  <CardHeader>
                    <CardTitle>Chọn phần bài thi TOEIC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {toeicParts.map((part) => (
                        <div
                          key={part.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`part-${part.id}`}
                            checked={selectedParts.includes(part.id)}
                            onCheckedChange={() => togglePart(part.id)}
                          />
                          <label
                            htmlFor={`part-${part.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Part {part.id}: {part.name}
                            <Badge variant="secondary" className="ml-2">
                              {part.questions} câu hỏi
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="time-limit"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Chọn thời gian làm bài
                      </label>
                      <Select value={timeLimit} onValueChange={setTimeLimit}>
                        <SelectTrigger id="time-limit" className="w-full">
                          <SelectValue placeholder="Chọn thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeLimits.map((limit) => (
                            <SelectItem key={limit.value} value={limit.value}>
                              {limit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full"
                      onClick={startPractice}
                      disabled={selectedParts.length === 0}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Bắt đầu luyện tập với {selectedParts.length} phần đã chọn
                      {timeLimit !== "0" &&
                        ` (${
                          timeLimits.find((t) => t.value === timeLimit)?.label
                        })`}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="real">
                <Card>
                  <CardHeader>
                    <CardTitle>Bài thi TOEIC đầy đủ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Bài thi TOEIC đầy đủ bao gồm tất cả các phần và có thời
                      gian làm bài chuẩn là 2 giờ.
                    </p>
                    <Button className="w-full" onClick={startRealTest}>
                      Bắt đầu bài thi TOEIC đầy đủ
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Bảng xếp hạng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{user.rank}.</span>
                        <span>{user.name}</span>
                      </div>
                      <Badge variant="secondary">{user.score} điểm</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
