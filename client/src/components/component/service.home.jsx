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
      description:
        "Advanced AI-powered tools to enhance your TOEIC preparation experience.",
      icon: Brain,
    },
    {
      title: "Flashcards",
      description:
        "Interactive flashcards to boost your vocabulary and language skills efficiently.",
      icon: Square,
    },
    {
      title: "Practice Exams",
      description:
        "Realistic TOEIC practice exams to assess and improve your test-taking abilities.",
      icon: FileSpreadsheet,
    },
    {
      title: "Result Analysis",
      description:
        "Detailed analysis of your exam performance to identify strengths and areas for improvement.",
      icon: BarChart2,
    },
  ];

  return (
    <div className="container mx-auto px-4 ">
      <h2 className="text-3xl font-bold text-center mb-8">
        Our TOEIC Preparation Services
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
