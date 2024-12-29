"use client";

import { useState } from "react";
import { TranscriptTestSidebar } from "@/components/component/transcipt-test.sidebar";
import { TranscriptTestCart } from "@/components/component/transcript-test.cart";
import instance from "../../../configs/axios.instance";
import { endpoint } from "../../../consts";
import { useEffect } from "react";

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
