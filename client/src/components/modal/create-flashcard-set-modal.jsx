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
import useInput from "~hooks/useInput";
import instance from "~configs/axios.instance";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { handleErrorWithToast } from "~helper";

export function CreateFlashcardSetModal({ setFC, setSetFC }) {
  const [open, setOpen] = useState(false);
  const title = useInput();
  const description = useInput();
  const { endpoint } = useEndpoint();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await instance.post(endpoint.setFlashcard.create, {
        title: title.value,
        description: description.value,
      });
      if (!data) {
        return;
      }
      setSetFC((pre) => {
        return [data, ...pre];
      });
    } catch (error) {
      handleErrorWithToast(error);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Flashcard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo danh sách thẻ nhớ</DialogTitle>
          {/* <DialogDescription>
          Tạo danh sách thẻ nhớ mới
          </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Tiêu đề
              </Label>
              <Input
                id="title"
                value={title.value}
                onChange={title.onChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={description.value}
                onChange={description.onChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
