import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { genAI } from "./instance";

const schema = {
  description:
    "Generate TOEIC improvement suggestions based on test performance data.",
  type: SchemaType.OBJECT,
  properties: {
    accuracyImprovement: {
      type: SchemaType.OBJECT,
      properties: {
        lowAccuracyParts: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
            description: "Part numbers with low accuracy",
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
            "5": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 5",
            },
            "6": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 6",
            },
            "7": {
              type: SchemaType.INTEGER,
              description: "Recommended time for Part 7",
            },
          },
          description: "Recommended time allocation for each part.",
        },
      },
      required: ["partTimeRecommendations"],
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
  required: ["accuracyImprovement", "timeManagement", "overallStrategy"],
};

export const recommendPrompt = (data: any) => {
  const dataString = JSON.stringify(data);
  return `
  Hãy phân tích dữ liệu này và đưa ra một kế hoạch học tập chi tiết để cải thiện điểm số TOEIC, tập trung vào các điểm yếu của tôi. Kế hoạch này cần bao gồm:
  * **Phân tích chi tiết từng phần thi:** Chỉ ra những điểm mạnh, điểm yếu cụ thể trong từng phần và giải thích nguyên nhân, đối với part 1,2,3,4 thì không cần đề cập tới thời gian.
  * **Đề xuất cụ thể cho từng loại câu hỏi:** Đưa ra các ví dụ cụ thể về các loại câu hỏi tôi cần tập trung luyện tập và cách tiếp cận hiệu quả.
  * **Kế hoạch học tập chi tiết:** Lập một kế hoạch học tập cụ thể cho từng tuần, bao gồm các tài liệu học tập gợi ý, thời gian dành cho từng phần và các phương pháp học tập hiệu quả.
  * **Chiến lược tổng thể:** Đưa ra những lời khuyên chung về cách tiếp cận việc học TOEIC, ví dụ như cách quản lý thời gian, làm thế nào để duy trì động lực, v.v.

  Dữ liệu này là kết quả bài thi TOEIC của tôi, bao gồm các thông tin chi tiết về hiệu suất thi, thời gian làm bài và các chỉ số gợi ý cải thiện.

  ${dataString}

  **Yêu cầu:**
  * **Chi tiết:** Cung cấp thông tin chi tiết, cụ thể cho từng phần.
  * **Rõ ràng:** Sử dụng ngôn ngữ đơn giản, dễ hiểu.
  * **Hệ thống:** Trình bày thông tin theo một cấu trúc logic, dễ theo dõi.
  * **Thực tế:** Đưa ra những gợi ý phù hợp với tình hình thực tế của người học.
  `;
};

export const modelAIRecommend = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  //   generationConfig: {
  //     responseMimeType: "application/json",
  //     responseSchema: schema,
  //   },
});
