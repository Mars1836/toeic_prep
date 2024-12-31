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
import { Loader2, Lock, PlusIcon } from "lucide-react";
import useInput from "@/hooks/useInput";
import { toast } from "react-toastify";
import instance from "~configs/axios.instance";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import useFetch from "~hooks/useFetch";
import { useSelector } from "react-redux";
const AICompletion = async (word) => {
  // Trong thực tế, đây sẽ là một cuộc gọi API đến dịch vụ AI
  const { data } = await instance.post(endpoint.aichat.getFlashcardInfor, {
    prompt: word,
  });
  return data;
};
export function CreateFlashcardModal({ setId, setFlashcards }) {
  const { endpoint } = useEndpoint();
  const [open, setOpen] = useState(false);
  const inputWord = useInput("");
  const inputDefinition = useInput("");
  const inputTranslation = useInput("");
  const inputExample1 = useInput("");
  const inputExample2 = useInput("");
  const inputPronunciation = useInput("");
  const inputNote = useInput("");
  const inputPartOfSpeech = useInput("");
  const [isLoading, setIsLoading] = useState(false);
  const isUpgraded = useSelector((state) => state.user.data.isUpgraded);
  const goToUpgrade = () => {
    setOpen(false);
    router.push("/upgrade");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const flashcard = {
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
    const { data } = await instance.post(
      endpoint.flashcardItem.create,
      flashcard
    );
    if (data) {
      toast.success("Lưu flashcard thành công");
      inputWord.clear();
      inputDefinition.clear();
      inputTranslation.clear();
      inputExample1.clear();
      inputExample2.clear();
      inputPronunciation.clear();
      inputNote.clear();
      inputPartOfSpeech.clear();
      setFlashcards((pre) => {
        return [data, ...pre];
      });
    }
  };
  const handleAutoComplete = async () => {
    setIsLoading(true);
    try {
      if (inputWord.value === "") {
        toast.error("Vui lòng nhập từ");
        return;
      }
      const data = await AICompletion(inputWord.value);

      const aiResult = JSON.parse(data);
      if (aiResult) {
        inputDefinition.setInput(aiResult?.definition || "");
        inputTranslation.setInput(aiResult?.translation || "");
        inputExample1.setInput(aiResult?.example1 || "");
        inputExample2.setInput(aiResult?.example2 || "");
        inputPronunciation.setInput(aiResult?.pronunciation || "");
        inputNote.setInput(aiResult?.note || "");
        inputPartOfSpeech.setInput(aiResult?.partOfSpeech.join(",") || "");
        toast.success("Hoàn tất tự động điền");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra vui lòng thử lại");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {}, [isLoading]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Tạo từ mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle> Add new word</DialogTitle>
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
                <span className="text-red-500"> *</span>
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
                Example 1<span className="text-red-500"> *</span>
              </Label>
              <Input
                id="example1"
                value={inputExample1.value}
                onChange={inputExample1.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="example" className="text-right">
                Example 2<span className="text-red-500"> *</span>
              </Label>
              <Input
                id="example2"
                value={inputExample2.value}
                onChange={inputExample2.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
                <span className="text-red-500"> *</span>
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
                <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="part_of_speech"
                value={inputPartOfSpeech.value}
                onChange={inputPartOfSpeech.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pronunciation" className="text-right">
                Pronunciation
                <span className="text-red-500"> *</span>
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
          <DialogFooter>
            {isUpgraded ? (
              <Button
                onClick={handleAutoComplete}
                disabled={isLoading}
                className=""
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tự động điền...
                  </>
                ) : (
                  "Tự động điền bằng AI"
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="link"
                  className="text-blue-500"
                  onClick={goToUpgrade}
                >
                  Nâng cấp để sử dụng
                </Button>
                <Button
                  className=" bg-gray-200 text-gray-500 cursor-not-allowed"
                  disabled
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Tự động điền bằng AI
                </Button>
              </>
            )}
            <Button type="submit" variant="">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
