"use client";

import { useState } from "react";
import { TranscriptTestSidebar } from "@/components/component/transcipt-test.sidebar";
import { TranscriptTestCart } from "@/components/component/transcript-test.cart";
import instance from "../../../configs/axios.instance";
import { endpoint } from "../../../consts";
import { useEffect } from "react";
const reviews = [
  {
    title: "Review TOEIC Part 1",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "11",
    part: 1,
  },
  {
    title: "Review TOEIC Part 2",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "11",
    part: 2,
  },
  {
    title: "Review TOEIC Part 3",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "11",
    part: 3,
  },
  {
    title: "Review TOEIC Part 4",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "11",
    part: 4,
  },
  {
    title: "Review TOEIC Part 1",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "10",
    part: 1,
  },
  {
    title: "Review TOEIC Part 2",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "10",
    part: 2,
  },
  {
    title: "Review TOEIC Part 3",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "10",
    part: 3,
  },
  {
    title: "Review TOEIC Part 4",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "10",
    part: 4,
  },
  {
    title: "Review TOEIC Part 1",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "9",
    part: 1,
  },
  {
    title: "Review TOEIC Part 2",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "9",
    part: 2,
  },
  {
    title: "Review TOEIC Part 3",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "9",
    part: 3,
  },
  {
    title: "Review TOEIC Part 4",
    imageUrl: "/placeholder.svg?height=200&width=300",
    month: "9",
    part: 4,
  },
];

export default function TranscriptTestPage() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [transcriptTestData, setTranscriptTestData] = useState([]);
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const filteredTranscriptTest = transcriptTestData.filter((review) => {
    if (activeFilters.length === 0) return true;
    return activeFilters.includes(`part${review.part}`);
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rs = await instance.get(endpoint.transcriptTest.getByQuery);
        setTranscriptTestData(rs.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [activeFilters]);
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <TranscriptTestSidebar onFilterChange={handleFilterChange} />
      <main className="flex-1 p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTranscriptTest.map((transcriptTest, index) => (
            <TranscriptTestCart
              transcriptTest={transcriptTest}
              key={transcriptTest.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
