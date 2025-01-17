"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// const rawData = {
//   ActionDescription: {
//     part: 1,
//     title: "Action Description",
//     accuracy: "33.33%",
//   },
//   PersonPosition: {
//     part: 1,
//     title: "Person Position",
//     accuracy: "0.00%",
//   },
//   EnvironmentSetting: {
//     part: 1,
//     title: "Environment Setting",
//     accuracy: "50.00%",
//   },
//   YesNoQuestion: {
//     part: 2,
//     title: "Yes/No Question",
//     accuracy: "33.33%",
//   },
//   WhQuestion: {
//     part: 2,
//     title: "Wh-Question",
//     accuracy: "0.00%",
//   },
//   ChoiceQuestion: {
//     part: 2,
//     title: "Choice Question",
//     accuracy: "25.00%",
//   },
//   ConversationPurpose: {
//     part: 3,
//     title: "Conversation Purpose",
//     accuracy: "0.00%",
//   },
//   RelationshipInference: {
//     part: 3,
//     title: "Relationship Inference",
//     accuracy: "66.67%",
//   },
//   DetailComprehension: {
//     part: 3,
//     title: "Detail Comprehension",
//     accuracy: "16.67%",
//   },
//   EmotionIntention: {
//     part: 3,
//     title: "Emotion and Intention",
//     accuracy: "25.00%",
//   },
//   OutcomePredict: {
//     part: 3,
//     title: "Outcome Prediction",
//     accuracy: "0.00%",
//   },
//   MainTopicIdentification: {
//     part: 4,
//     title: "Main Topic Identification",
//     accuracy: "0.00%",
//   },
//   DetailExtraction: {
//     part: 4,
//     title: "Detail Extraction",
//     accuracy: "25.00%",
//   },
//   ImpliedInformation: {
//     part: 4,
//     title: "Implied Information",
//     accuracy: "25.00%",
//   },
//   ContextRecognition: {
//     part: 4,
//     title: "Context Recognition",
//     accuracy: "75.00%",
//   },
//   VocabularyFill: {
//     part: 5,
//     title: "Vocabulary Fill",
//     accuracy: "25.00%",
//   },
//   PrepositionChoice: {
//     part: 5,
//     title: "Preposition Choice",
//     accuracy: "33.33%",
//   },
//   TenseUsage: {
//     part: 5,
//     title: "Tense Usage",
//     accuracy: "0.00%",
//   },
//   GrammarStructure: {
//     part: 5,
//     title: "Grammar Structure",
//     accuracy: "50.00%",
//   },
//   VerbFormSelection: {
//     part: 5,
//     title: "Verb Form Selection",
//     accuracy: "50.00%",
//   },
//   VocabularyInsertion: {
//     part: 6,
//     title: "Vocabulary Insertion",
//     accuracy: "0.00%",
//   },
//   LogicalCompletion: {
//     part: 6,
//     title: "Logical Completion",
//     accuracy: "50.00%",
//   },
//   TextCoherence: {
//     part: 6,
//     title: "Text Coherence",
//     accuracy: "0.00%",
//   },
//   SentenceRelationship: {
//     part: 6,
//     title: "Sentence Relationship",
//     accuracy: "50.00%",
//   },
//   MainIdea: {
//     part: 7,
//     title: "Main Idea",
//     accuracy: "33.33%",
//   },
//   DetailInformation: {
//     part: 7,
//     title: "Detail Information",
//     accuracy: "20.00%",
//   },
//   WordInference: {
//     part: 7,
//     title: "Word Inference",
//     accuracy: "28.57%",
//   },
//   InformationRelationship: {
//     part: 7,
//     title: "Information Relationship",
//     accuracy: "0.00%",
//   },
//   ComparativeAnalysis: {
//     part: 7,
//     title: "Comparative Analysis",
//     accuracy: "25.00%",
//   },
// };

const processedData = (data) => {
  return Object.entries(data).map(([key, value]) => {
    return {
      ...value,
      key,
    };
  });
};

const partColors = {
  1: "var(--chart-1)",
  2: "var(--chart-2)",
  3: "var(--chart-3)",
  4: "var(--chart-4)",
  5: "var(--chart-5)",
  6: "var(--chart-6)",
  7: "var(--chart-8)",
};

export function CategoryAccuracyChart({ categoryAccuracy, timeRange }) {
  const [selectedPart, setSelectedPart] = useState("all");
  const filteredData = useMemo(() => {
    return selectedPart === "all"
      ? processedData(categoryAccuracy)
      : processedData(categoryAccuracy).filter(
          (item) => item.part === selectedPart
        );
  }, [selectedPart, categoryAccuracy]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort(
      (a, b) => a.part - b.part || b.accuracy - a.accuracy
    );
  }, [filteredData]);
  useEffect(() => {}, [sortedData]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Biểu đồ độ chính xác các phần</CardTitle>
        <CardDescription>Độ chính xác các phần theo từng phần</CardDescription>
      </CardHeader>
      <CardContent c>
        <div className="mb-10">
          <Select
            onValueChange={(value) =>
              setSelectedPart(value === "all" ? "all" : parseInt(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a part" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parts</SelectItem>
              {Array.from({ length: 7 }, (_, i) => i + 1).map((part) => (
                <SelectItem key={part} value={part.toString()}>
                  Part {part}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ChartContainer
          config={Object.fromEntries(
            Object.entries(partColors).map(([part, color]) => [
              `part${part}`,
              {
                label: `Part ${part}`,
                color: color,
              },
            ])
          )}
          className="h-[600px] translate-x-[-300px] sm:translate-x-[-300px]  md:translate-x-[-250px] lg:translate-x-[-96px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 220, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="title" type="category" width={200} />
              <Tooltip content={<ChartTooltipContent />} />

              <Legend
                payload={Object.entries(partColors).map(([part, color]) => ({
                  value: `Part ${part}`,
                  type: "square",
                  color: color,
                }))}
              />
              <Bar dataKey="accuracy" name="Accuracy">
                {sortedData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={partColors[`${entry.part}`]} // Gán màu cho từng thanh từ partColors
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
