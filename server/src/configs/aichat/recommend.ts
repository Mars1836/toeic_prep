import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { genAI } from "./instance";
import { UserTargetScore } from "../../models/user.model";
const schema = {
  description:
    "Generate TOEIC improvement suggestions based on test performance data.",
  type: SchemaType.OBJECT,
  properties: {
    metadata: {
      type: SchemaType.OBJECT,
      properties: {
        testDate: {
          type: SchemaType.STRING,
          description: "Date of the TOEIC test (e.g., YYYY-MM-DD).",
        },
        currentScores: {
          type: SchemaType.OBJECT,
          properties: {
            listening: {
              type: SchemaType.INTEGER,
              description: "Listening score.",
            },
            reading: {
              type: SchemaType.INTEGER,
              description: "Reading score.",
            },
          },
          description: "Current scores for listening and reading.",
        },
        targetScores: {
          type: SchemaType.OBJECT,
          properties: {
            listening: {
              type: SchemaType.INTEGER,
              description: "Target listening score.",
            },
            reading: {
              type: SchemaType.INTEGER,
              description: "Target reading score.",
            },
          },
          description: "Target scores for improvement.",
        },
      },
      required: ["testDate", "currentScores", "targetScores"],
    },
    accuracyImprovement: {
      type: SchemaType.OBJECT,
      properties: {
        lowAccuracyParts: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
            description: "Part numbers with low accuracy.",
          },
          description: "List of parts with low accuracy.",
        },
        focusAreas: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
            description: "Categories of questions with low accuracy.",
          },
          description: "List of question categories requiring more practice.",
        },
      },
      required: ["lowAccuracyParts", "focusAreas"],
    },
    timeManagement: {
      type: SchemaType.OBJECT,
      properties: {
        partTimeRecommendations: {
          type: SchemaType.OBJECT,
          properties: {
            "1": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 1.",
            },
            "2": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 2.",
            },
            "3": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 3.",
            },
            "4": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 4.",
            },
            "5": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 5.",
            },
            "6": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 6.",
            },
            "7": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 7.",
            },
          },
          description: "Recommended time allocation for each part.",
        },
      },
      required: ["partTimeRecommendations"],
    },
    skillImprovement: {
      type: SchemaType.OBJECT,
      properties: {
        listening: {
          type: SchemaType.STRING,
          description: "Suggestions for improving listening skills.",
        },
        reading: {
          type: SchemaType.STRING,
          description: "Suggestions for improving reading skills.",
        },
      },
      required: ["listening", "reading"],
    },
    overallStrategy: {
      type: SchemaType.OBJECT,
      properties: {
        strategySuggestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
            description: "Overall strategies to improve TOEIC score.",
          },
          description: "Suggestions for overall test-taking strategies.",
        },
      },
      required: ["strategySuggestions"],
    },
  },
  required: [
    "metadata",
    "accuracyImprovement",
    "timeManagement",
    "skillImprovement",
    "overallStrategy",
  ],
};

export const recommendPrompt = (data: any, targetScore: UserTargetScore) => {
  const dataString = JSON.stringify(data);
  let notHaveTargetScore = `
Hãy phân tích dữ liệu này và đưa ra một kế hoạch học tập chi tiết để cải thiện điểm số TOEIC, tập trung vào các điểm yếu của tôi. Kế hoạch này cần bao gồm:

Phân tích chi tiết từng phần thi:
Chỉ ra những điểm mạnh, điểm yếu cụ thể trong từng phần và giải thích nguyên nhân. Đối với các phần nghe (Part 1, 2, 3, 4), không cần đề cập tới thời gian. Phân tích dựa trên hiệu suất hiện tại, chỉ ra các phần cần ưu tiên cải thiện.

Đề xuất cụ thể cho từng loại câu hỏi:
Đưa ra các ví dụ cụ thể về các loại câu hỏi tôi cần tập trung luyện tập, giải thích lý do và đề xuất cách tiếp cận hiệu quả.

Kế hoạch học tập chi tiết:
Lập một kế hoạch học tập cụ thể cho từng tuần, bao gồm:

- Các tài liệu học tập gợi ý.
- Thời gian dành cho từng phần (Listening và Reading).
- Các phương pháp học tập hiệu quả giúp cải thiện điểm theo từng phần.

Chiến lược tổng thể:
Đưa ra những lời khuyên chung về cách tiếp cận việc học TOEIC, ví dụ như cách quản lý thời gian, làm thế nào để duy trì động lực, và các mẹo làm bài thi.

Dữ liệu này là kết quả bài thi TOEIC của tôi, bao gồm các thông tin chi tiết về hiệu suất thi, thời gian làm bài và các chỉ số gợi ý cải thiện.

`;
  let haveTargetScore = `
 Hãy phân tích dữ liệu này và đưa ra một kế hoạch học tập chi tiết để cải thiện điểm số TOEIC, tập trung vào các điểm yếu của tôi. Kế hoạch này cần bao gồm:

Phân tích chi tiết từng phần thi:
Chỉ ra những điểm mạnh, điểm yếu cụ thể trong từng phần và giải thích nguyên nhân. Đối với các phần nghe (Part 1, 2, 3, 4), không cần đề cập tới thời gian. Đánh giá dựa trên các mục tiêu:

Mục tiêu Reading: Đạt ${targetScore.reading} điểm.
Mục tiêu Listening: Đạt ${targetScore.listening} điểm.
So sánh điểm hiện tại với mục tiêu và phân tích từng khoảng cách. Nếu khoảng cách lớn, hãy chỉ ra những kỹ năng cần cải thiện gấp; nếu khoảng cách nhỏ, đưa ra các gợi ý để tối ưu hóa hiệu suất.

Đề xuất cụ thể cho từng loại câu hỏi:
Đưa ra các ví dụ cụ thể về các loại câu hỏi tôi cần tập trung luyện tập, giải thích lý do và đề xuất cách tiếp cận hiệu quả.

Kế hoạch học tập chi tiết:
Lập một kế hoạch học tập cụ thể cho từng tuần, bao gồm:

Các tài liệu học tập gợi ý.
Thời gian dành cho từng phần (Listening và Reading).
Các phương pháp học tập hiệu quả giúp cải thiện điểm theo từng phần.
Chiến lược tổng thể:
Đưa ra những lời khuyên chung về cách tiếp cận việc học TOEIC, ví dụ như cách quản lý thời gian, làm thế nào để duy trì động lực, và các mẹo làm bài thi.

Dữ liệu này là kết quả bài thi TOEIC của tôi, bao gồm các thông tin chi tiết về hiệu suất thi, thời gian làm bài và các chỉ số gợi ý cải thiện.
${dataString}
`;
  if (targetScore) {
    return haveTargetScore;
  }
  return notHaveTargetScore;
};
export const modelAIRecommend = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // generationConfig: {
  //   responseMimeType: "application/json",
  //   responseSchema: schema,
  // },
});
