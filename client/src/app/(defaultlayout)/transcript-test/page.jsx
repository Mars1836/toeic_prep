"use client";

import { useState, useEffect } from "react";
import { TranscriptTestSidebar } from "@/components/component/transcipt-test.sidebar";
import { TranscriptTestCart } from "@/components/component/transcript-test.cart";
import instance from "../../../configs/axios.instance";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function TranscriptTestPage() {
  const { endpoint } = useEndpoint();
  const [activeFilters, setActiveFilters] = useState([]);
  const [transcriptTestData, setTranscriptTestData] = useState([]);
  const [loadingTranscriptTest, setLoadingTranscriptTest] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        console.error(error);
      }
    };
    fetchData();
  }, [activeFilters]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      {/* Mobile Sidebar Toggle */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <TranscriptTestSidebar onFilterChange={handleFilterChange} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <TranscriptTestSidebar onFilterChange={handleFilterChange} />
      </div>

      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        {loadingTranscriptTest ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredTranscriptTest.map((transcriptTest) => (
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
