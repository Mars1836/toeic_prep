"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import useInput from "@/hooks/useInput";

export function CreateFlashcardModal() {
  const [open, setOpen] = useState(false);
  const inputWord = useInput("");
  const inputDefinition = useInput("");
  const inputTranslation = useInput("");
  const inputExample = useInput("");
  const inputPronunciation = useInput("");
  const inputNote = useInput("");
  const inputPartOfSpeech = useInput("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend or state management
    console.log("New flashcard:", { front, back });
    setFront("");
    setBack("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add new word
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle> Add new word</DialogTitle>
          <DialogDescription>
            Add a new word to your flashcard set.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-96 overflow-scroll">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="word" className="text-right">
                Word
              </Label>
              <Input
                id="word"
                value={inputWord.value}
                onChange={inputWord.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="translation" className="text-right">
                Translation
              </Label>
              <Input
                id="translation"
                value={inputTranslation.value}
                onChange={inputTranslation.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="definition" className="text-right">
                Definition
              </Label>
              <Input
                id="definition"
                value={inputDefinition.value}
                onChange={inputDefinition.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="example" className="text-right">
                Example
              </Label>
              <Textarea
                id="example"
                value={inputExample.value}
                onChange={inputExample.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <Input
                id="note"
                value={inputNote.value}
                onChange={inputNote.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="part_of_speech" className="text-right">
                Part of speech
              </Label>
              <Textarea
                value={inputWord.value}
                onChange={inputWord.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pronunciation" className="text-right">
                Pronunciation
              </Label>
              <Input
                id="pronunciation"
                value={inputPronunciation.value}
                onChange={inputPronunciation.onChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" variant="">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
