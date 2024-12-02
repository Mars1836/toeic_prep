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
import { useRouter } from "next/navigation";
import { endpoint } from "~consts";
import instance from "~configs/axios.instance";
import { convertSeconds, formatDate } from "~helper";
import withAuth from "~HOC/withAuth";

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
  { value: "45", label: "45 phút" },
  { value: "60", label: "1 giờ" },
  { value: "75", label: "1 giờ 15 phút" },
  { value: "90", label: "1 giờ 30 phút" },
  { value: "120", label: "2 giờ" },
];

function Component({ params }) {
  const [selectedParts, setSelectedParts] = React.useState([]);
  const [timeLimit, setTimeLimit] = React.useState("0");
  const [testData, setTestData] = React.useState([]);
  const router = useRouter();
  const id = params.id;
  const togglePart = (partId) => {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };
  const getAttempts = (test) => {
    if (!test?.attempts?.length) {
      return 0;
    }
    return test.attempts.reduce((acc, curr) => {
      return acc + curr.times;
    }, 0);
  };
  const startPractice = () => {
    const sortPart = selectedParts.sort((a, b) => a - b);
    const query = new URLSearchParams({
      parts: sortPart.join(","), // Nối các phần của danh sách thành chuỗi
      time: timeLimit.toString(), // Thêm thời gian
    });
    router.push(`/test3/${id}/practice?${query.toString()}`);
  };

  const startRealTest = () => {
    const sortPart = testData.parts.sort((a, b) => a - b);
    const query = new URLSearchParams({
      parts: sortPart.join(","), // Nối các phần của danh sách thành chuỗi
      time: testData.duration.toString(), // Thêm thời gian
    });
    router.push(`/test3/${id}/practice?${query.toString()}`);
  };
  React.useEffect(() => {
    async function fetchTesttData() {
      const { data } = await instance.get(endpoint.test.getById, {
        params: { id: id },
      });
      console.log(data);
      setTestData(data);
    }
    fetchTesttData();
  }, []);
  return (
    testData && (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">
                  Practice Set 2023 TOEIC Test 9
                </h1>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {getAttempts(testData)} lượt làm
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    56 bình luận
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Cập nhật {formatDate(testData.createdAt)}
                  </span>
                </div>
              </div>

              <Tabs defaultValue="practice">
                <TabsList className="grid max-w-80 grid-cols-2 bg-gray-300">
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
                              <Badge variant="primary" className="ml-2">
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
                        Bắt đầu luyện tập với {selectedParts.length} phần đã
                        chọn
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
                      <p className="mb-4 ">
                        Bài thi TOEIC đầy đủ bao gồm tất cả các phần và có thời
                        gian làm bài chuẩn là{" "}
                        {convertSeconds(testData.duration * 60)}.
                      </p>
                      <Button className="w-full" onClick={startRealTest}>
                        Bắt đầu bài thi TOEIC đầy đủ
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            {/* 
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
                    <div key={user.rank} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{user.rank}.</span>
                        <span>{user.name}</span>
                      </div>
                      <Badge variant="primary">{user.score} điểm</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div> */}
          </div>
        </main>
      </div>
    )
  );
}
export default withAuth(Component);
