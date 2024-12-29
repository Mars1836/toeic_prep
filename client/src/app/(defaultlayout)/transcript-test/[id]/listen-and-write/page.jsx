"use client";
import AudioTranscription from "@/components/component/listen-and-write.audio-transcript";
import { useState, useEffect } from "react";
import instance from "@/configs/axios.instance";
import { endpoint } from "@/consts";

export default function ListenAndWritePage({ params }) {
  const [questionData, setQuestionData] = useState([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const transcriptTestId = params.id;
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
    };
    fetchData();
  }, [transcriptTestId]);
  return (
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
