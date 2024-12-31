"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Play, Pause } from "lucide-react";
import instance from "@/configs/axios.instance";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { Loader2 } from "lucide-react";

const checkWordAccuracy = (sampleWordsObjects, recognizedWords) => {
  const result = [];
  let recognizedIndex = 0;

  for (let i = 0; i < sampleWordsObjects.length; i++) {
    const word = sampleWordsObjects[i].word;
    let isMatched = false;
    let tempIndex = recognizedIndex;

    // Tìm kiếm từ trong recognizedWords từ vị trí hiện tại
    while (tempIndex < recognizedWords.length) {
      if (recognizedWords[tempIndex] === word) {
        isMatched = true;
        recognizedIndex = tempIndex + 1;
        break;
      }
      tempIndex++;
    }

    result.push({ ...sampleWordsObjects[i], isTrue: isMatched });
  }

  return result;
};

function splitAndIndexWords(input) {
  const regex = /\b[\w']+\b/g; // Biểu thức chính quy tìm từ
  let match;
  const result = [];

  while ((match = regex.exec(input)) !== null) {
    result.push({
      word: match[0].toLowerCase(), // Từ đã chuyển về chữ thường
      startIndex: match.index, // Vị trí bắt đầu của từ trong chuỗi
      endIndex: match.index + match[0].length, // Vị trí cuối của từ
    });
  }

  return result;
}

function splitAndLowercase(input) {
  // Tách chuỗi thành các từ và chuyển tất cả về chữ thường
  return (input.match(/\b[\w']+\b/g) || []).map((word) => word.toLowerCase());
}
const PronunciationChecker = ({ question }) => {
  const { endpoint } = useEndpoint();
  const [audioUrl, setAudioUrl] = useState(question.audioUrl);
  const [currentSentence, setCurrentSentence] = useState(question.transcript);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedSentence, setRecognizedSentence] = useState("");
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioSourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (err) {}
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Dừng visualization và đóng AudioContext
      cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      // Tạo formData và gửi đến API
    }
  };
  useEffect(() => {
    if (!recordedAudio) return;
    const fetchData = async () => {
      const formData = new FormData();
      if (recordedAudio) {
        const audioBlob = await fetch(recordedAudio).then((res) => res.blob());
        formData.append("audio", audioBlob, "recording.webm");
      }

      try {
        setIsLoading(true);
        const { data } = await instance.post(
          endpoint.provider.speechToText,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setIsLoading(false);
        // Xử lý kết quả từ API
        if (data && data.transcript) {
          setRecognizedSentence(data.transcript);
        } else {
          console.error("API không trả về dữ liệu mong đợi.");
        }
      } catch (err) {
        setIsLoading(false);
        console.error("Lỗi khi gọi API:", err);
      }
    };
    fetchData();
  }, [recordedAudio]);
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

      const barWidth = (canvas.width / dataArray.length) * 1;
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
  useEffect(() => {
    if (recognizedSentence) {
      let result = splitAndIndexWords(currentSentence);
      let recognizedWords = splitAndLowercase(recognizedSentence);
      let checkResult = checkWordAccuracy(result, recognizedWords);
      setResult(checkResult);
    }
  }, [recognizedSentence]);
  useEffect(() => {
    setAudioUrl(question.audioUrl);
    setCurrentSentence(question.transcript);
  }, [question]);
  return (
    <div className="max-w-md mx-auto p-4 bg-transparent">
      <div className="text-center mb-4 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Kiểm Tra Phát Âm</h2>
        <p className="text-gray-600 font-semibold mb-4">{currentSentence}</p>
        {audioUrl && <audio src={endpoint.originUrlUpload + audioUrl} controls />}
      </div>

      <canvas
        ref={canvasRef}
        width="400"
        height="100"
        className="w-full mb-4 border rounded"
      />

      <div className="flex justify-center space-x-4 mb-4">
        {!isRecording && !isLoading ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
          >
            <Mic size={24} />
          </button>
        ) : isLoading ? (
          <button className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 transition">
            <Loader2 className="h-6 w-6 animate-spin" />
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
          <div>
            <button
              onClick={playAudio}
              className={`${
                isPlaying
                  ? "bg-yellow-500 text-white"
                  : "bg-blue-500 text-white"
              } p-2 rounded-full hover:opacity-80 transition`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <audio
              ref={audioRef}
              src={recordedAudio}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          </div>
        )}
      </div>

      {result.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Kết Quả Phát Âm</h3>
          <div className="flex flex-wrap gap-2">
            {result.map((result, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded ${
                  result.isTrue
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
