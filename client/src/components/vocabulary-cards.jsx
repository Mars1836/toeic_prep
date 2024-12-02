'use client';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InfoIcon } from 'lucide-react'

const vocabularyList = [
  {
    english: "Serendipity",
    vietnamese: "Tình cờ may mắn",
    definition: "The occurrence and development of events by chance in a happy or beneficial way",
    example: "They found their dream home by serendipity.",
    note: "Often used to describe pleasant surprises or fortunate accidents",
    memoryScore: 8,
    memoryCoefficient: 0.9
  },
  {
    english: "Ephemeral",
    vietnamese: "Ngắn ngủi, tạm thời",
    definition: "Lasting for a very short time",
    example: "The ephemeral beauty of cherry blossoms",
    note: "Often used in poetry and literature to describe fleeting moments",
    memoryScore: 6,
    memoryCoefficient: 0.7
  },
  {
    english: "Ubiquitous",
    vietnamese: "Phổ biến, có mặt khắp nơi",
    definition: "Present, appearing, or found everywhere",
    example: "Smartphones have become ubiquitous in modern society",
    note: "Often used to describe technology or cultural phenomena",
    memoryScore: 4,
    memoryCoefficient: 0.5
  }
]

const getScoreColor = score => {
  if (score >= 8) return "bg-green-500"
  if (score >= 5) return "bg-yellow-500"
  return "bg-red-500"
}

const getCoefficientColor = coefficient => {
  if (coefficient >= 0.8) return "bg-blue-500"
  if (coefficient >= 0.5) return "bg-purple-500"
  return "bg-pink-500"
}

const StatusExplanationModal = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-10">
        <InfoIcon className="w-4 h-4 mr-1" /> Status Info
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Status Explanation</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Memory Score</h3>
          <p>Indicates how well you remember the word:</p>
          <ul className="list-disc list-inside">
            <li><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>8-10: Excellent recall</li>
            <li><span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>5-7: Good recall</li>
            <li><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>0-4: Needs review</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Memory Coefficient</h3>
          <p>Represents the rate of improvement in remembering the word:</p>
          <ul className="list-disc list-inside">
            <li><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>0.8-1.0: Fast improvement</li>
            <li><span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2"></span>0.5-0.7: Moderate improvement</li>
            <li><span className="inline-block w-3 h-3 rounded-full bg-pink-500 mr-2"></span>0.0-0.4: Slow improvement</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

const VocabularyCard = ({ item }) => (
  <Card className="w-full relative pb-12">
    <CardHeader>
      <CardTitle>{item.english}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="font-semibold text-lg mb-2">{item.vietnamese}</p>
      <p className="mb-2"><span className="font-semibold">Definition:</span> {item.definition}</p>
      <p className="mb-2"><span className="font-semibold">Example:</span> {item.example}</p>
      <p><span className="font-semibold">Note:</span> {item.note}</p>
    </CardContent>
    <CardFooter
      className="absolute bottom-2 left-2 right-2 flex justify-end items-center">
      <div className="flex gap-2">
        <Badge className={`${getScoreColor(item.memoryScore)} text-white`}>
          Score: {item.memoryScore}
        </Badge>
        <Badge className={`${getCoefficientColor(item.memoryCoefficient)} text-white`}>
          Coef: {item.memoryCoefficient.toFixed(1)}
        </Badge>
      </div>
    </CardFooter>
  </Card>
)

export function VocabularyCardsComponent() {
  return (
    (<div className="container mx-auto p-4 pb-16">
      <h1 className="text-2xl font-bold mb-4">Vocabulary Cards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vocabularyList.map((item, index) => (
          <VocabularyCard key={index} item={item} />
        ))}
      </div>
      <StatusExplanationModal />
    </div>)
  );
}