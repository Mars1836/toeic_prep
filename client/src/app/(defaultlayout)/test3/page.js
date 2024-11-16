"use client";
import { useEffect, useState } from "react";
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
import instance from "~configs/axios.instance";
import { endpoint } from "~consts";
import { ExamCard } from "~components/component/test_card";
import withAuth from "../../../HOC/withAuth";

// function ExamResultCard({ result, onViewDetails }) {
//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle className="text-xl font-bold">{result.title}</CardTitle>
//       </CardHeader>
//       <CardContent className="grid gap-4">
//         <div className="flex items-center space-x-2">
//           <CalendarDays className="w-4 h-4 text-muted-foreground" />
//           <span className="text-sm">{result.date}</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Clock className="w-4 h-4 text-muted-foreground" />
//           <span className="text-sm">{result.duration}</span>
//         </div>
//         <div className="grid grid-cols-3 gap-4">
//           <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
//             <CheckCircle className="w-5 h-5 mb-1 text-green-500" />
//             <span className="text-xs text-muted-foreground">Correct</span>
//             <span className="font-semibold">{result.correctAnswers}</span>
//           </div>
//           <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
//             <PenTool className="w-5 h-5 mb-1 text-blue-500" />
//             <span className="text-xs text-muted-foreground">Attempted</span>
//             <span className="font-semibold">{result.attemptedQuestions}</span>
//           </div>
//           <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
//             <HelpCircle className="w-5 h-5 mb-1 text-orange-500" />
//             <span className="text-xs text-muted-foreground">Total</span>
//             <span className="font-semibold">{result.totalQuestions}</span>
//           </div>
//         </div>
//         <Badge variant="secondary" className="w-fit">
//           {result.type}
//         </Badge>
//         <Button onClick={() => onViewDetails(result.id)} className="w-full">
//           View Details
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

function TestPage() {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [testData, setTestData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const { data } = await instance.get(endpoint.test.getByQuery, {
        params: {
          limit: 30,
        },
      });
      setTestData(data);
    }
    fetchData();
  }, []);
  const itemsPerPage = 1;

  const filteredResults = testData.filter(
    (result) => filter === "all" || result.type === filter
  );

  const totalPages = Math.ceil(testData.length / itemsPerPage);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Exam Results</h1>
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
        {currentResults.map((card) => (
          <ExamCard key={card.id} card={card} />
        ))}
      </div>
      <div className="mt-6 text-center">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
export default withAuth(TestPage);
