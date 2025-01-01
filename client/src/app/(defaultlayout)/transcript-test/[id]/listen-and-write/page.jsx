"use client";
import AudioTranscription from "@/components/component/listen-and-write.audio-transcript";
import { useState, useEffect } from "react";
import instance from "@/configs/axios.instance";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { Loader2 } from "lucide-react";
export default function ListenAndWritePage({ params }) {
  const { endpoint } = useEndpoint();
  const [questionData, setQuestionData] = useState([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const transcriptTestId = params.id;
  const [loadingData, setLoadingData] = useState(true);
  const handlePrevious = () => {
    setIndexQuestion(indexQuestion - 1);
  };
  const handleNext = () => {
    setIndexQuestion(indexQuestion + 1);
  };
  useEffect(() => {
    const fetchData = async () => {
      const rs = await instance.get(
        endpoint.transcriptTestItem.getByTranscriptTestId,
        {
          params: {
            transcriptTestId,
          },
        }
      );
      setQuestionData(rs.data);
      setLoadingData(false);
    };
    fetchData();
  }, [transcriptTestId]);
  return loadingData ? (
    <div className="flex justify-center items-center w-full mt-10">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    questionData?.length > 0 && (
      <main className="container mx-auto p-4 mt-10">
        <AudioTranscription
          question={questionData[indexQuestion]}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          indexQuestion={indexQuestion}
          totalQuestion={questionData.length}
        />
      </main>
    )
  );
}
