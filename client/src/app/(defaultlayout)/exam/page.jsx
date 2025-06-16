"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import instance from "~configs/axios.instance";
import { useRouter } from "next/navigation";

export default function ExamPage() {
  const { endpoint } = useEndpoint();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchSessions = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      const response = await instance.get(
        `${endpoint.toeicTestSession.getByUser}?page=${page}&limit=${limit}`
      );
      setSessions(response.data.data);
      setPagination(response.data.pagination);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setIsLoading(false);
      toast.error("Không thể tải danh sách bài thi");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [endpoint]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchSessions(newPage, pagination.limit);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStartExam = (sessionId) => {
    router.push(`/exam/${sessionId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Danh sách bài thi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Bài thi của bạn</h3>
              </div>
              <div className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.totalPages}
              </div>
            </div>

            <div className="relative">
              <div
                className={`grid grid-cols-1 gap-4 transition-all duration-300 ${
                  isLoading ? "opacity-50 blur-sm" : "opacity-100 blur-0"
                }`}
              >
                {sessions.map((session) => (
                  <Card
                    key={session.test.id}
                    className="hover:border-blue-300 transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="font-semibold text-lg">
                            {session.test.title}
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Trung tâm:</span>{" "}
                              {session.toeicTest.testCenter}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Thời gian:</span>{" "}
                              {formatDate(session.toeicTest.timeStart)} -{" "}
                              {formatTime(session.toeicTest.timeEnd)}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Số câu hỏi:</span>{" "}
                              {session.test.numberOfQuestions} câu
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                Thời gian làm bài:
                              </span>{" "}
                              {session.test.duration} phút
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleStartExam(session.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Bắt đầu thi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={
                  pagination.page === pagination.totalPages || isLoading
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
