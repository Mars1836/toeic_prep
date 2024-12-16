"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import WaveSurfer from "wavesurfer.js";

const EnglishPronunciationPractice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sampleText, setSampleText] = useState(
    "The quick brown fox jumps over the lazy dog"
  );
  const [result, setResult] = useState([]);
  const [audioContext, setAudioContext] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const mediaRecorder = useRef(null);
  const recognitionRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setTranscript(transcript);
        };
      } else {
        console.warn("Speech recognition not supported in this browser");
      }
    }

    // Initialize WaveSurfer
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "violet",
      progressColor: "purple",
      cursorColor: "navy",
      height: 100,
      interact: false,
      normalize: true,
    });

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(audioCtx);

      const source = audioCtx.createMediaStreamSource(stream);
      wavesurfer.current.load(source);

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();

      setIsRecording(true);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      checkResult();
    }

    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
    }

    if (audioContext) {
      audioContext.close();
    }

    wavesurfer.current.empty();
  };

  const checkResult = () => {
    const sampleWords = sampleText.toLowerCase().split(" ");
    const transcriptWords = transcript.toLowerCase().split(" ");

    const result = sampleWords.map((word, index) => ({
      word,
      correct:
        index < transcriptWords.length && word === transcriptWords[index],
    }));

    setResult(result);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>English Pronunciation Practice</CardTitle>
        <CardDescription>
          Practice your English pronunciation with real-time feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-semibold">{sampleText}</div>
        <div ref={waveformRef} className="w-full h-24"></div>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        {result.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <p>
              {result.map((item, index) => (
                <span
                  key={index}
                  className={item.correct ? "text-green-500" : "text-red-500"}
                >
                  {item.word}{" "}
                </span>
              ))}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnglishPronunciationPractice;
