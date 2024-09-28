"use client";
import React, { useEffect, useState } from "react";
import { listOfSetFlashCard } from "@/dbTest/flashcard";
import WordCard from "@/components/flashcard/word_card";
import { Button } from "@/components/ui/button";
import { Shuffle, Trash2 } from "lucide-react";
import Link from "next/link";
function loadFlashcardSet(id) {
  return listOfSetFlashCard.find((item) => {
    return item.id === id;
  });
}
function FCDetailPage({ params }) {
  //id of set flashcard
  const id = params.id;
  const [flashcards, setFlashcards] = useState([]);
  const [setCard, setSetCard] = useState({});
  useEffect(() => {
    const set = loadFlashcardSet(id);
    if (set) {
      setFlashcards(set.flashcards);
      setSetCard({ ...set });
    }
  }, [id]);
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="mx-auto px-4 py-8 md:px-6">
        <div className="my-4">
          <h1 className="mb-4 text-2xl font-bold">
            Flashcards:{setCard.title}
          </h1>
          <div className="mb-10 flex gap-2">
            <Button>Chỉnh sửa</Button>
            <Button>Thêm từ mới</Button>
            <Button>Tạo hàng loạt</Button>
          </div>
        </div>
        <div className="my-4">
          <Button className="w-full" variant="outline">
            Luyện tập flashcard
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href={`${id}/random`} className="w-full">
            <Button variant="outline" className="w-full">
              <Shuffle className="mr-2 h-4 w-4" />
              Xem ngẫu nhiên
            </Button>
          </Link>

          <Button variant="outline">
            <Trash2 className="mr-2 h-4 w-4" />
            Dừng học bộ này
          </Button>
        </div>
        <p className="text-muted-foreground mb-4 font-medium">
          Bộ này có {flashcards.length} từ
        </p>
        <div className="flex flex-col gap-4">
          {flashcards.map((fc, index) => {
            return <WordCard flashcard={fc}></WordCard>;
          })}
        </div>
      </div>
    </div>
  );
}

export default FCDetailPage;
