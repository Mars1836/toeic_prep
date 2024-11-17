"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book } from "lucide-react";

// This would typically come from an API or database
const flashcardSets = [
  { id: 1, name: "Basic Math", cardCount: 20 },
  { id: 2, name: "World Capitals", cardCount: 50 },
  { id: 3, name: "Spanish Vocabulary", cardCount: 100 },
  { id: 4, name: "Science Terms", cardCount: 30 },
  { id: 5, name: "Historical Dates", cardCount: 40 },
  { id: 6, name: "Programming Concepts", cardCount: 60 },
];

export function FlashcardSetSelectorComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);

  const handleSetSelection = (set) => {
    setSelectedSet(set);
    setIsOpen(false);
  };

  return (
    <div className=" space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Select Flashcard Set</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Choose a Flashcard Set</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] mt-4 p-4 rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcardSets.map((set) => (
                <Card key={set.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Book className="mr-2 h-4 w-4" />
                      {set.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{set.cardCount} cards</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      className="w-full"
                      onClick={() => handleSetSelection(set)}
                    >
                      Select
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {selectedSet && (
        <div className="mt-4 p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">
            Selected Set: {selectedSet.name}
          </h2>
          <p>Number of cards: {selectedSet.cardCount}</p>
          <p className="mt-2">You can start learning this set now!</p>
          {/* Add your flashcard learning component here */}
          <Button className="mt-4" onClick={() => setIsOpen(true)}>
            Change Set
          </Button>
        </div>
      )}
    </div>
  );
}
