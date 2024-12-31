"use client";
import React, { useEffect, useState } from "react";
import WordCard from "@/components/flashcard/word_card";
import { Button } from "@/components/ui/button";
import { Shuffle, Trash2 } from "lucide-react";
import Link from "next/link";
import { CreateFlashcardModal } from "@/components/modal/create-flashcard-modal";
import ExcelUploader from "../../../../../components/excelupload/ExcelUploader";
import instance from "~configs/axios.instance";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { handleErrorWithToast } from "~helper";
import { useRouter } from "next/navigation";
import { UpdateFlashcardSetModal } from "@/components/modal/update-flashcard-set-modal";
function FCDetailPage({ params }) {
  const { endpoint } = useEndpoint();
  //id of set flashcard
  const id = params.id;
  const [flashcards, setFlashcards] = useState([]);
  const [setCard, setSetCard] = useState({});
  const router = useRouter();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  useEffect(() => {
    async function fetchFlashcards() {
      const { data } = await instance.get(endpoint.flashcardItem.getBySet, {
        params: {
          setFlashcardId: id,
        },
      });
      const { data: setData } = await instance.get(
        endpoint.setFlashcard.getById,
        {
          params: {
            id: id,
          },
        }
      );
      setFlashcards(data);
      setSetCard(setData);
    }
    fetchFlashcards();
  }, []);
  const handleStudy = async () => {
    try {
      const { data } = await instance.post(endpoint.learningSet.addSetToLearn, {
        setFlashcardId: id,
      });
      if (!data) {
        return;
      }
      router.push(`/flashcards/studying/${data.id}/quiz`);
    } catch (error) {
      handleErrorWithToast(error);
    }
  };
  return (
    setCard && (
      <div className="flex min-h-[100dvh] flex-col">
        <div className="mx-auto px-2 py-8 md:px-2 md:w-[700px] lg:w-[900px]">
          <div className="my-4">
            <h1 className="mb-4 text-2xl font-bold">
              Flashcards: {setCard.title}
            </h1>
            <p className="text-muted-foreground mb-4 font-medium">
              {setCard.description}
            </p>
            <div className="mb-10 flex gap-2">
              <Button onClick={() => setIsUpdateDialogOpen(true)}>
                Chỉnh sửa
              </Button>
              <CreateFlashcardModal setId={id} setFlashcards={setFlashcards} />
              <ExcelUploader
                setId={id}
                setFlashcards={setFlashcards}
              ></ExcelUploader>
            </div>
          </div>
          <div className="my-4 w-full">
            <Button className="w-full" variant="outline" onClick={handleStudy}>
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
          <div className="flex flex-col gap-4 w-full">
            {flashcards.map((fc, index) => {
              return (
                <WordCard
                  flashcard={fc}
                  key={fc.id}
                  setFlashcards={setFlashcards}
                ></WordCard>
              );
            })}
          </div>
        </div>
        <UpdateFlashcardSetModal
          setFCFocused={setCard}
          open={isUpdateDialogOpen}
          setOpen={setIsUpdateDialogOpen}
        ></UpdateFlashcardSetModal>
      </div>
    )
  );
}

export default FCDetailPage;
