"use client";

import { useState } from "react";
import { TranscriptTestSidebar } from "@/components/component/transcipt-test.sidebar";
import { TranscriptTestCart } from "@/components/component/transcript-test.cart";
import instance from "../../../configs/axios.instance";
import { useEffect } from "react";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { Loader2 } from "lucide-react";
import { delay } from "~helper";
export default function TranscriptTestPage() {
  const { endpoint } = useEndpoint();
  const [activeFilters, setActiveFilters] = useState([]);
  const [transcriptTestData, setTranscriptTestData] = useState([]);
  const [loadingTranscriptTest, setLoadingTranscriptTest] = useState(true);
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
        setLoadingTranscriptTest(false);
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
        {loadingTranscriptTest ? (
          <div className="flex justify-center items-center w-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTranscriptTest.map((transcriptTest, index) => (
              <TranscriptTestCart
                transcriptTest={transcriptTest}
                key={transcriptTest.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
