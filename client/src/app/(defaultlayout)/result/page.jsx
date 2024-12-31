"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExamResultCard } from "@/components/component/result_card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  PenTool,
  HelpCircle,
} from "lucide-react";
import instance from "~configs/axios.instance";
import { ExamCard } from "~components/component/test_card";
import withAuth from "../../../HOC/withAuth";
import { useSelector } from "react-redux";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
function ResultPage() {
  const { endpoint } = useEndpoint();
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [resultData, setResultData] = useState([]);
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    if (!user) {
      return;
    }
    async function fetchResultData() {
      try {
        const { data } = await instance.get(endpoint.result.getResultByUser, {
          params: {
            limit: 30,
          },
        });
        setResultData(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchResultData();
  }, [user]);
  const itemsPerPage = 6;

  const filteredResults = resultData.filter(
    (result) => filter === "all" || result?.testId?.type === filter
  );

  const totalPages = Math.ceil(resultData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (!isNaN(page)) {
      handlePageChange(page);
      setPageInput("");
    }
  };

  return currentResults.length > 0 ? (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Kết quả bài thi</h1>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by exam type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="miniexam">Mini Exam</SelectItem>
            <SelectItem value="fullexam">Full Exam</SelectItem>
            <SelectItem value="read">Reading</SelectItem>
            <SelectItem value="listen">Listening</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <form
            onSubmit={handlePageInputSubmit}
            className="flex items-center space-x-2"
          >
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={handlePageInputChange}
              className="w-16 text-center"
              placeholder={currentPage.toString()}
            />
            <span>of {totalPages}</span>
            <Button type="submit">Go</Button>
          </form>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentResults.map((result) => (
          <ExamResultCard key={result.id} result={result} />
        ))}
      </div>
      <div className="mt-6 text-center">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Không có kết quả bài thi nào
      </h1>
    </div>
  );
}
export default withAuth(ResultPage);
