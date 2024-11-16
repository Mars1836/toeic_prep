"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Volume2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UpdateFlashcardModal } from "~components/modal/update-flashcard-modal";
export default function WordCard({ flashcard, setFlashcards }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleUpdate = () => {
    setIsUpdateDialogOpen(true);
    console.log("update");
  };

  const handleRemove = () => {
    setIsAlertOpen(true);
  };

  const confirmRemove = () => {
    setFlashcards((pre) => {
      return pre.filter((item) => {
        return item.id !== flashcard.id;
      });
    });
    setIsAlertOpen(false);
  };
  const speak = () => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(flashcard.word);
      utterance.lang = "en-US";
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };
  if (!flashcard) {
    return <p>WordCard</p>;
  }
  return (
    flashcard && (
      <Card className="w-full relative">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-3xl font-bold">
                {flashcard.word}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={speak}
                disabled={isPlaying}
                aria-label="Listen to pronunciation"
              >
                <Volume2Icon className={isPlaying ? "animate-pulse" : ""} />
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              {flashcard.partOfSpeech ? (
                Array.isArray(flashcard.partOfSpeech) ? (
                  flashcard.partOfSpeech.map((part, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {part}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-sm">
                    {flashcard.partOfSpeech}
                  </Badge>
                )
              ) : (
                <p></p>
              )}
              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleUpdate}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <span>Update</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRemove}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Remove</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="text-muted-foreground text-sm">
            {flashcard.pronunciation}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <h3 className="mb-1 font-semibold">Translate:</h3>
            <p className="font-semibold">{flashcard.translation}</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Definition:</h3>
            <p>{flashcard.definition}</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Example Sentences:</h3>
            <ul className="list-disc space-y-1 pl-5">
              {flashcard.exampleSentence?.map((sentence, index) => (
                <li key={index}>{sentence}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Note:</h3>
            <p>{flashcard.note}</p>
          </div>
          <div className="flex justify-center space-x-3"></div>
        </CardContent>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn xóa không?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn dữ
                liệu của bạn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRemove}>
                Xác nhận xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <UpdateFlashcardModal
          isUpdateDialogOpen={isUpdateDialogOpen}
          setIsUpdateDialogOpen={setIsUpdateDialogOpen}
          flashcard={flashcard}
          setFlashcards={setFlashcards}
        ></UpdateFlashcardModal>
      </Card>
    )
  );
}
