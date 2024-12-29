import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Loader2, Lock, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { handleErrorWithToast } from "~helper";
import { endpoint } from "~consts";
import instance from "~configs/axios.instance";
import { useRouter } from "next/navigation";
function getExplanation(option, explanData) {
  if (!option?.label || !explanData?.explanation) {
    return "Thông tin không đầy đủ để cung cấp giải thích.";
  }

  return option.label === explanData.correctAnswer
    ? explanData.explanation.correctReason ||
        "Không có lý do đúng được cung cấp."
    : explanData.explanation.incorrectReasons?.[option.label] ||
        "Không có lý do sai được cung cấp.";
}
function ChooseOption({
  question,
  isCheck = false,
  value,
  paragraph,
  handleChooseOption = () => {},
}) {
  const isUpgraded = useSelector((state) => state.user.data.isUpgraded);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowTranscription, setIsShowTranscription] = useState(false);
  const router = useRouter();
  const goToUpgrade = () => {
    router.push("/upgrade");
  };
  const [selectedOption, setSelectedOption] = useState(value);
  const [explanData, setExplanData] = useState("");
  const handleOptionChange = (value) => {
    if (isCheck) {
      return;
    }
    setSelectedOption(value);
    handleChooseOption(value);
  };
  const isAnswerCorrect = () => {
    return question.correctanswer === selectedOption;
  };
  const handleGetExplanation = async () => {
    setIsLoading(true);
    try {
      const { data } = await instance.post(endpoint.aichat.getExplanation, {
        prompt: { ...question, paragraph },
      });
      // const data =
      //   '{"correctAnswer": "D", "explanation": {"correctReason": "Trong câu này, \\"support\\" được sử dụng như một danh từ không đếm được, mang nghĩa \\"sự hỗ trợ\\". Cụm từ \\"technical support\\" mang nghĩa \\"hỗ trợ kỹ thuật\\".", "incorrectReasons": {"A": "\\"Supported\\" là động từ ở dạng quá khứ phân từ, mang nghĩa \\"được hỗ trợ\\". Nó không phù hợp với ngữ cảnh của câu.", "B": "\\"Supporter\\" là danh từ, mang nghĩa \\"người hỗ trợ\\". Sử dụng từ này trong câu sẽ làm câu không đúng ngữ pháp và sai nghĩa.", "C": "\\"Supporting\\" là động từ ở dạng hiện tại phân từ hoặc tính từ, mang nghĩa \\"hỗ trợ, ủng hộ\\". Từ này không phù hợp về mặt ngữ pháp và nghĩa trong câu này."\n        ,\n          "D": ""\n        }\n    },\n  "options": [\n    {\n      "label": "A",\n      "text": "supported"\n    },\n        {\n            "label": "B",\n            "text": "supporter"\n        },\n    {\n      "label": "C",\n      "text": "supporting"\n    },\n    {\n      "label": "D",\n      "text": "support"\n        }\n  ]\n}';
      if (data) {
        const parsedData = JSON.parse(data);
        setExplanData(parsedData);
      }
    } catch (error) {
      handleErrorWithToast(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <RadioGroup
        value={selectedOption || ""}
        onValueChange={handleOptionChange}
        className="mb-4"
      >
        {question.options.map((option, index) => (
          <div key={option.id} className="mb-2 flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={`q${question.id}-${index}`} />
            <Label htmlFor={`q${question.id}-${index}`}>
              {option.id}
              {!isCheck &&
                ![1, 2].includes(question.part) &&
                `. ${option.content}`}
              {isCheck && `. ${option.content}`}
            </Label>

            {isCheck && option.id === question.correctanswer && (
              <CheckCircle className="ml-2 text-green-500" />
            )}
            {isCheck &&
              option.id === selectedOption &&
              option.id !== question.correctanswer && (
                <XCircle className="ml-2 text-red-500" />
              )}
          </div>
        ))}
      </RadioGroup>
      {isCheck && (
        <p
          className={`mb-4 font-bold ${
            isAnswerCorrect() ? "text-green-500" : "text-red-500"
          }`}
        >
          {isAnswerCorrect()
            ? "Correct!"
            : "Incorrect. The correct answer is " +
              question.correctanswer +
              "."}
        </p>
      )}
      {isCheck && [3, 4].includes(question.part) && question.transcript && (
        <div className="mb-4">
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
                {question.transcript}
              </pre>
            </div>
          )}
        </div>
      )}
      {isCheck && [5, 6, 7].includes(question.part) && (
        <div>
          {isUpgraded ? (
            <Button
              onClick={handleGetExplanation}
              disabled={isLoading}
              className="my-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo lời giải...
                </>
              ) : (
                "Tạo lời giải bằng AI"
              )}
            </Button>
          ) : (
            <>
              <Button
                variant="link"
                className="text-blue-500 my-4"
                onClick={goToUpgrade}
              >
                Nâng cấp để sử dụng
              </Button>
              <Button
                className=" bg-gray-200 text-gray-500 cursor-not-allowed"
                disabled
              >
                <Lock className="mr-2 h-4 w-4" />
                Tạo lời giải bằng AI
              </Button>
            </>
          )}
        </div>
      )}
      {explanData && (
        <div className="mb-4 space-y-4">
          <h3 className="font-bold text-lg">Explanations:</h3>
          {explanData.options.map((option) => (
            <div
              key={option.label}
              className={`p-4 rounded-md ${
                option.label === explanData.correctAnswer
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <p className="font-semibold mb-2">
                {option.label}. {option.text}
              </p>
              <p>{getExplanation(option, explanData)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChooseOption;
