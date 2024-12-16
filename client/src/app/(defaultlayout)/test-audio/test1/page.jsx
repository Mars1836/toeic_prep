"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Volume2, Play, Pause } from "lucide-react";

// Mock data - trong thực tế, bạn sẽ thay thế bằng API thực tế
const PRONUNCIATION_DATA = [
  {
    sentence: "The quick brown fox jumps over the lazy dog",
    words: [
      { word: "the", correct_pronunciation: true },
      { word: "quick", correct_pronunciation: true },
      { word: "brown", correct_pronunciation: true },
      { word: "fox", correct_pronunciation: true },
      { word: "jumps", correct_pronunciation: true },
      { word: "over", correct_pronunciation: true },
      { word: "the", correct_pronunciation: true },
      { word: "lazy", correct_pronunciation: true },
      { word: "dog", correct_pronunciation: true },
    ],
  },
];

const PronunciationChecker = () => {
  const [currentSentence, setCurrentSentence] = useState(PRONUNCIATION_DATA[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationResults, setPronunciationResults] = useState([]);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioSourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Thiết lập AudioContext và Analyser
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      analyser.fftSize = 256;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Khởi tạo MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(blob);
        setRecordedAudio(audioURL);

        // Reset chunks
        chunks.length = 0;
      };

      mediaRecorderRef.current = mediaRecorder;

      // Bắt đầu ghi và vẽ wave
      mediaRecorder.start();
      setIsRecording(true);
      visualizeAudio();

      // Đặt timeout để dừng tự động sau 5 giây
      setTimeout(stopRecording, 10000);
    } catch (err) {
      console.error("Lỗi khi bắt đầu ghi âm:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Dừng visualization và đóng AudioContext
      cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Mô phỏng kết quả kiểm tra phát âm (trong thực tế sẽ gọi API)
      const mockResults = currentSentence.words.map((wordData) => ({
        ...wordData,
        correct_pronunciation: Math.random() > 0.3,
      }));

      setPronunciationResults(mockResults);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const visualizeAudio = () => {
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      canvasContext.fillStyle = "rgb(240, 240, 240)";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let x = 0;

      dataArray.forEach((value) => {
        const barHeight = value / 2;

        canvasContext.fillStyle = `rgb(50, 150, ${value + 100})`;
        canvasContext.fillRect(
          x,
          canvas.height - barHeight,
          barWidth,
          barHeight
        );

        x += barWidth + 1;
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold mb-2">Kiểm Tra Phát Âm</h2>
        <p className="text-gray-600">{currentSentence.sentence}</p>
      </div>

      <canvas
        ref={canvasRef}
        width="400"
        height="100"
        className="w-full mb-4 border rounded"
      />

      <div className="flex justify-center space-x-4 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
          >
            <Mic size={24} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
          >
            <StopCircle size={24} />
          </button>
        )}

        {recordedAudio && (
          <button
            onClick={playAudio}
            className={`${
              isPlaying ? "bg-yellow-500 text-white" : "bg-blue-500 text-white"
            } p-2 rounded-full hover:opacity-80 transition`}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        )}
      </div>

      {recordedAudio && (
        <audio
          ref={audioRef}
          src={recordedAudio}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {pronunciationResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Kết Quả Phát Âm</h3>
          <div className="flex flex-wrap gap-2">
            {pronunciationResults.map((result, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded ${
                  result.correct_pronunciation
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {result.word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PronunciationChecker;
