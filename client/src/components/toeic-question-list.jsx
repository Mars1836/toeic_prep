"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock questions (replace with actual questions and answers)
const generateQuestions = () => {
  const questions = []
  for (let i = 1; i <= 200; i++) {
    if (i <= 100) {
      questions.push({
        id: i,
        text: `Listening: What does the speaker mean when they say "..."?`,
        section: "Listening",
        options: [
          { id: "A", text: "Option A" },
          { id: "B", text: "Option B" },
          { id: "C", text: "Option C" },
          { id: "D", text: "Option D" },
        ],
      })
    } else {
      questions.push({
        id: i,
        text: `Reading: According to the passage, what is the main idea of paragraph 2?`,
        section: "Reading",
        options: [
          { id: "A", text: "Option A" },
          { id: "B", text: "Option B" },
          { id: "C", text: "Option C" },
          { id: "D", text: "Option D" },
        ],
      })
    }
  }
  return questions
}

export function ToeicQuestionList() {
  const [selectedQuestion, setSelectedQuestion] = useState(1)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const questions = generateQuestions()

  const handleAnswerChange = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }))
  }

  const handleNextQuestion = () => {
    setSelectedQuestion((prev) => Math.min(prev + 1, 200))
  }

  const handlePreviousQuestion = () => {
    setSelectedQuestion((prev) => Math.max(prev - 1, 1))
  }

  return (
    (<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">TOEIC Test Questions</h1>
      <div className="flex justify-end mb-6">
        <Button asChild>
          <Link href="/start-test">Start Test</Link>
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Question {selectedQuestion}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{questions[selectedQuestion - 1].text}</p>
            <RadioGroup
              value={selectedAnswers[selectedQuestion] || ""}
              onValueChange={(value) => handleAnswerChange(selectedQuestion, value)}>
              {questions[selectedQuestion - 1].options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option.id} id={`q${selectedQuestion}-${option.id}`} />
                  <Label htmlFor={`q${selectedQuestion}-${option.id}`}>{option.id}. {option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handlePreviousQuestion} disabled={selectedQuestion === 1}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={handleNextQuestion} disabled={selectedQuestion === 200}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-full md:w-64">
          <CardHeader>
            <CardTitle>Question List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-4 gap-1 p-4">
                {questions.map((question) => (
                  <Button
                    key={question.id}
                    variant={selectedQuestion === question.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedQuestion(question.id)}
                    className={`w-full transition-all duration-200 ${
                      selectedAnswers[question.id]
                        ? "bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
                        : ""
                    } ${
                      selectedQuestion === question.id
                        ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900"
                        : ""
                    }`}>
                    {question.id}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 text-center">
        <Button asChild>
          <Link href="/start-test">Start Test</Link>
        </Button>
      </div>
    </div>)
  );
}