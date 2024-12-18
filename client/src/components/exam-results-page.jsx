"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const examResults = [
  {
    id: "1",
    title: "TOEIC Listening and Reading",
    date: "2024-03-15",
    duration: "2 hours",
    correctAnswers: 180,
    attemptedQuestions: 195,
    totalQuestions: 200,
    type: "full exam",
  },
  {
    id: "2",
    title: "TOEIC Speaking",
    date: "2024-03-20",
    duration: "20 minutes",
    correctAnswers: 160,
    attemptedQuestions: 170,
    totalQuestions: 200,
    type: "mini exam",
  },
  {
    id: "3",
    title: "TOEIC Writing",
    date: "2024-03-25",
    duration: "60 minutes",
    correctAnswers: 140,
    attemptedQuestions: 150,
    totalQuestions: 200,
    type: "mini exam",
  },
  {
    id: "4",
    title: "TOEIC Reading Practice",
    date: "2024-04-01",
    duration: "45 minutes",
    correctAnswers: 85,
    attemptedQuestions: 90,
    totalQuestions: 100,
    type: "read",
  },
  {
    id: "5",
    title: "TOEIC Listening Practice",
    date: "2024-04-05",
    duration: "45 minutes",
    correctAnswers: 78,
    attemptedQuestions: 85,
    totalQuestions: 100,
    type: "listen",
  },
  // Add more exam results as needed
];

function ExamResultCard({ result, onViewDetails }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{result.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{result.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{result.duration}</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
            <CheckCircle className="w-5 h-5 mb-1 text-green-500" />
            <span className="text-xs text-muted-foreground">Correct</span>
            <span className="font-semibold">{result.correctAnswers}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
            <PenTool className="w-5 h-5 mb-1 text-blue-500" />
            <span className="text-xs text-muted-foreground">Attempted</span>
            <span className="font-semibold">{result.attemptedQuestions}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
            <HelpCircle className="w-5 h-5 mb-1 text-orange-500" />
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="font-semibold">{result.totalQuestions}</span>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          {result.type}
        </Badge>
        <Button onClick={() => onViewDetails(result.id)} className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export function ExamResultsPage() {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const itemsPerPage = 6;

  const handleViewDetails = (id) => {
    console.log(`Viewing details for exam with id: ${id}`);
    // In a real application, you would navigate to a details page or open a modal here
  };

  const filteredResults = examResults.filter(
    (result) => filter === "all" || result.type === filter
  );

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
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
      <h1 className="text-3xl font-bold mb-6 text-center">
        Kết quả thi của bạn
      </h1>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by exam type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="mini exam">Mini Exam</SelectItem>
            <SelectItem value="full exam">Full Exam</SelectItem>
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
          <ExamResultCard
            key={result.id}
            result={result}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      <div className="mt-6 text-center">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Không có kết quả thi nào
      </h1>
    </div>
  );
}
