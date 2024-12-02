"use client";

import { useEffect, useState } from "react";
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
import { Loader2, PlusIcon, RefreshCw } from "lucide-react";
import useInput from "@/hooks/useInput";
import { toast } from "react-toastify";
import instance from "~configs/axios.instance";
import { endpoint } from "~consts";

export function UpdateFlashcardModal({
  isUpdateDialogOpen,
  setIsUpdateDialogOpen,
  setId,
  setFlashcards,
  flashcard,
}) {
  const inputWord = useInput(flashcard.word || "");
  const inputDefinition = useInput(flashcard.definition || "");
  const inputTranslation = useInput(flashcard.translation || "");
  const inputExample1 = useInput(flashcard.exampleSentence[0] || "");
  const inputExample2 = useInput(flashcard.exampleSentence[1] || "");
  const inputPronunciation = useInput(flashcard.pronunciation || "");
  const inputNote = useInput(flashcard.note || "");
  const inputPartOfSpeech = useInput(flashcard.partOfSpeech?.join(",") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nflashcard = {
      id: flashcard.id,
      word: inputWord.value, // Lấy giá trị của từ
      translation: inputTranslation.value, // Lấy bản dịch

      // Các thuộc tính khác
      setFlashcardId: setId,
      definition: inputDefinition.value || "", // Định nghĩa, nếu không rỗng
      exampleSentence: [inputExample1.value, inputExample2.value].filter(
        (sentence) => sentence !== ""
      ), // Các câu ví dụ không rỗng
      note: inputNote.value || "", // Ghi chú, nếu không rỗng
      partOfSpeech: inputPartOfSpeech.value
        ? inputPartOfSpeech.value.split(",")
        : "", // Tách các loại từ bằng dấu phẩy
      pronunciation: inputPronunciation.value || "", // Phiên âm, nếu không rỗng
    };
    const { data } = await instance.patch(
      endpoint.flashcardItem.update,
      nflashcard
    );
    if (data) {
      setIsUpdateDialogOpen(false);
      setFlashcards((pre) => {
        return pre.map((item) => {
          if (item.id === nflashcard.id) {
            return nflashcard;
          }
          return item;
        });
      });
      toast.success("Lưu flashcard thành công");
    }
  };

  useEffect(() => {}, [isLoading]);
  return (
    <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
      {/* <DialogTrigger asChild>
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Update</span>
        </>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle> Update word</DialogTitle>
          <DialogDescription>
            Add a new word to your flashcard set.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="">
          <div className="grid gap-4 py-4 ">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="word" className="text-right">
                Word <span className="text-red-500">*</span>
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
                <span className="text-red-500"> *</span>
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="example" className="text-right">
                Example 1
              </Label>
              <Input
                id="example1"
                value={inputExample1.value}
                onChange={inputExample1.onChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="example" className="text-right">
                Example 2
              </Label>
              <Input
                id="example2"
                value={inputExample2.value}
                onChange={inputExample2.onChange}
                className="col-span-3"
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="part_of_speech" className="text-right">
                Part of speech
              </Label>
              <Input
                value={inputPartOfSpeech.value}
                onChange={inputPartOfSpeech.onChange}
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" variant="">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
