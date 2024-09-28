"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VolumeIcon } from "lucide-react"

const partsOfSpeechMap = {
  V: "Verb",
  N: "Noun",
  Adj: "Adjective"
}

export function EnglishWordCardJsx() {
  const [isPlaying, setIsPlaying] = useState(false)

  const wordData = {
    word: "surrender",
    definition: "to stop fighting and admit that you have been defeated",
    exampleSentence: [
      "The soldiers surrendered after realizing they were surrounded.",
      "He had to surrender to the police after being on the run for weeks.",
      "The surrender of the city marked the end of the war.",
    ],
    note: "Used in both physical combat and situations of giving up control.",
    partOfSpeech: "V,N",
    translation: "đầu hàng",
    pronunciation: "/səˈren.dər/",
  }

  const speak = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true)
      const utterance = new SpeechSynthesisUtterance(wordData.word)
      utterance.lang = 'en-US'
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    } else {
      alert("Sorry, your browser doesn't support text to speech!")
    }
  }

  const partsOfSpeech = wordData.partOfSpeech.split(',').map(part => partsOfSpeechMap[part.trim()] || part.trim())

  return (
    (<Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-3xl font-bold">{wordData.word}</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={speak}
              disabled={isPlaying}
              aria-label="Listen to pronunciation">
              <VolumeIcon className={isPlaying ? "animate-pulse" : ""} />
            </Button>
          </div>
          <div className="flex gap-2">
            {partsOfSpeech.map((part, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {part}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {wordData.pronunciation} • {wordData.translation}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Definition:</h3>
          <p>{wordData.definition}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Example Sentences:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {wordData.exampleSentence.map((sentence, index) => (
              <li key={index}>{sentence}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Note:</h3>
          <p>{wordData.note}</p>
        </div>
      </CardContent>
    </Card>)
  );
}