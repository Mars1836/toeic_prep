"use client"

import { useState, useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const rawData = {
  "ActionDescription": {
    "part": 1,
    "title": "Action Description",
    "accuracy": "33.33%"
  },
  "PersonPosition": {
    "part": 1,
    "title": "Person Position",
    "accuracy": "0.00%"
  },
  "EnvironmentSetting": {
    "part": 1,
    "title": "Environment Setting",
    "accuracy": "50.00%"
  },
  "YesNoQuestion": {
    "part": 2,
    "title": "Yes/No Question",
    "accuracy": "33.33%"
  },
  "WhQuestion": {
    "part": 2,
    "title": "Wh-Question",
    "accuracy": "0.00%"
  },
  "ChoiceQuestion": {
    "part": 2,
    "title": "Choice Question",
    "accuracy": "25.00%"
  },
  "ConversationPurpose": {
    "part": 3,
    "title": "Conversation Purpose",
    "accuracy": "0.00%"
  },
  "RelationshipInference": {
    "part": 3,
    "title": "Relationship Inference",
    "accuracy": "66.67%"
  },
  "DetailComprehension": {
    "part": 3,
    "title": "Detail Comprehension",
    "accuracy": "16.67%"
  },
  "EmotionIntention": {
    "part": 3,
    "title": "Emotion and Intention",
    "accuracy": "25.00%"
  },
  "OutcomePredict": {
    "part": 3,
    "title": "Outcome Prediction",
    "accuracy": "0.00%"
  },
  "MainTopicIdentification": {
    "part": 4,
    "title": "Main Topic Identification",
    "accuracy": "0.00%"
  },
  "DetailExtraction": {
    "part": 4,
    "title": "Detail Extraction",
    "accuracy": "25.00%"
  },
  "ImpliedInformation": {
    "part": 4,
    "title": "Implied Information",
    "accuracy": "25.00%"
  },
  "ContextRecognition": {
    "part": 4,
    "title": "Context Recognition",
    "accuracy": "75.00%"
  },
  "VocabularyFill": {
    "part": 5,
    "title": "Vocabulary Fill",
    "accuracy": "25.00%"
  },
  "PrepositionChoice": {
    "part": 5,
    "title": "Preposition Choice",
    "accuracy": "33.33%"
  },
  "TenseUsage": {
    "part": 5,
    "title": "Tense Usage",
    "accuracy": "0.00%"
  },
  "GrammarStructure": {
    "part": 5,
    "title": "Grammar Structure",
    "accuracy": "50.00%"
  },
  "VerbFormSelection": {
    "part": 5,
    "title": "Verb Form Selection",
    "accuracy": "50.00%"
  },
  "VocabularyInsertion": {
    "part": 6,
    "title": "Vocabulary Insertion",
    "accuracy": "0.00%"
  },
  "LogicalCompletion": {
    "part": 6,
    "title": "Logical Completion",
    "accuracy": "50.00%"
  },
  "TextCoherence": {
    "part": 6,
    "title": "Text Coherence",
    "accuracy": "0.00%"
  },
  "SentenceRelationship": {
    "part": 6,
    "title": "Sentence Relationship",
    "accuracy": "50.00%"
  },
  "MainIdea": {
    "part": 7,
    "title": "Main Idea",
    "accuracy": "33.33%"
  },
  "DetailInformation": {
    "part": 7,
    "title": "Detail Information",
    "accuracy": "20.00%"
  },
  "WordInference": {
    "part": 7,
    "title": "Word Inference",
    "accuracy": "28.57%"
  },
  "InformationRelationship": {
    "part": 7,
    "title": "Information Relationship",
    "accuracy": "0.00%"
  },
  "ComparativeAnalysis": {
    "part": 7,
    "title": "Comparative Analysis",
    "accuracy": "25.00%"
  }
}

const processedData = Object.entries(rawData).map(([key, value]) => ({
  ...value,
  accuracy: parseFloat(value.accuracy.replace('%', '')),
  key
}))

const partColors = {
  1: "hsl(var(--chart-1))",
  2: "hsl(var(--chart-2))",
  3: "hsl(var(--chart-3))",
  4: "hsl(var(--chart-4))",
  5: "hsl(var(--chart-5))",
  6: "hsl(var(--chart-6))",
  7: "hsl(var(--chart-7))"
}

export default function CategoryAccuracyChart() {
  const [selectedPart, setSelectedPart] = useState("all")

  const filteredData = useMemo(() => {
    return selectedPart === "all" 
      ? processedData 
      : processedData.filter(item => item.part === selectedPart);
  }, [selectedPart])

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => a.part - b.part || b.accuracy - a.accuracy);
  }, [filteredData])

  return (
    (<Card className="w-full">
      <CardHeader>
        <CardTitle>Category Accuracy Chart</CardTitle>
        <CardDescription>Accuracy percentages for different categories grouped by parts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select
            onValueChange={(value) => setSelectedPart(value === "all" ? "all" : parseInt(value))}>
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
          config={Object.fromEntries(Object.entries(partColors).map(([part, color]) => [
            `part${part}`,
            {
              label: `Part ${part}`,
              color: color,
            },
          ]))}
          className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 220, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="title" type="category" width={200} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="accuracy" name="Accuracy">
                {sortedData.map((entry) => (
                  <rect key={entry.key} fill={partColors[entry.part]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>)
  );
}

