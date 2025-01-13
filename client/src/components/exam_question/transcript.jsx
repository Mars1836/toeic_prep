"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function Transcript({ part, transcript }) {
  const [isShowTranscription, setIsShowTranscription] = useState(false);

  return transcript && [3, 4].includes(part) ? (
    <div>
      <Button onClick={() => setIsShowTranscription(!isShowTranscription)}>
        {isShowTranscription ? "Ẩn transcription" : "Hiện transcription"}
      </Button>
      {isShowTranscription && (
        <div className="my-4 rounded border bg-yellow-100 p-4">
          <pre
            style={{
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {transcript}
          </pre>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}

export default Transcript;
