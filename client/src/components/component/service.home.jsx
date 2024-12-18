import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Square, FileSpreadsheet, BarChart2 } from "lucide-react";

export default function TOEICServices() {
  const services = [
    {
      title: "AI Render",
      description: "Công nghệ AI để tăng cường trải nghiệm Toeic của bạn.",
      icon: Brain,
    },
    {
      title: "Flashcards",
      description:
        "Flashcards tương tác để tăng cường vốn từ vựng và kỹ năng ngôn ngữ.",
      icon: Square,
    },
    {
      title: "Practice Exams",
      description:
        "Bài thi thực tế TOEIC để đánh giá và cải thiện kỹ năng làm bài thi.",
      icon: FileSpreadsheet,
    },
    {
      title: "Result Analysis",
      description:
        "Phân tích chi tiết kết quả thi của bạn để xác định những mặt mạnh và những điểm cần cải thiện.",
      icon: BarChart2,
    },
  ];

  return (
    <div className="container mx-auto px-12 ">
      <h2 className="text-3xl font-bold text-center mb-8">
        Dịch vụ của chúng tôi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 ">
                <service.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{service.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
