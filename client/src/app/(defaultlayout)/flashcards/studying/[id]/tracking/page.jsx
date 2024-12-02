"use client";
import React, { useEffect, useState } from "react";
import { listOfSetFlashCard } from "@/dbTest/flashcard";
import TrackingWordCard from "@/components/flashcard/tracking_word_card";
import { Button } from "@/components/ui/button";
import { Shuffle, Trash2 } from "lucide-react";
import Link from "next/link";
import instance from "~configs/axios.instance";
import { endpoint, RATE_LIMIT } from "~consts";
import { handleErrorWithToast } from "~helper";
import { useRouter } from "next/navigation";
import StatusExplanationModal from "@/components/modal/status_explanation_modal";
import { getLearningFlashcardData, getLearningSetData } from "../quiz/page";
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
import { toast } from "react-toastify";
function loadFlashcardSet(id) {
  return listOfSetFlashCard.find((item) => {
    return item.id === id;
  });
}
function getDiffDays(optimalTime) {
  return (
    (new Date(optimalTime).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24)
  );
}
function getRateDiffDays(learningFlashcard) {
  const diffDays = getDiffDays(learningFlashcard.optimalTime);
  let rate = diffDays / learningFlashcard.interval;
  if (!isFinite(rate)) {
    rate = RATE_LIMIT;
  }
  return rate;
}
function sortFlashcard(learningFlashcards) {
  let arr = learningFlashcards.map((fc) => {
    return {
      ...fc,
      rateDiffDays: getRateDiffDays(fc),
    };
  });
  arr.sort((a, b) => {
    return a.rateDiffDays - b.rateDiffDays;
  });
  return arr;
}

function TrackingFlashcardPage({ params }) {
  //id of set flashcard
  const id = params.id;
  const [learningFlashcardData, setLearningFlashcardData] = useState([]);
  const [learningSetData, setLearningSetData] = useState({});
  const router = useRouter();
  function handleRemoveLearningSet() {
    setIsAlertOpen(true);
  }
  async function handleRemoveLearningSetConfirm() {
    try {
      const { data } = await instance.delete(
        endpoint.learningSet.removeSetFromLearn,
        {
          data: {
            learningSetId: id,
          },
        }
      );
      if (data) {
        toast.success("Xóa thành công");
        router.push("/flashcards/studying");
      }
      setIsAlertOpen(false);
    } catch (error) {
      handleErrorWithToast(error);
    }
  }
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const learningSetData = await getLearningSetData(id);
      const learningFlashcardData = await getLearningFlashcardData(
        learningSetData.id
      );
      let sortedFlashcardData = sortFlashcard(learningFlashcardData);
      setLearningFlashcardData(sortedFlashcardData);
      setLearningSetData(learningSetData);
    }

    fetchData();
  }, []);

  const handleStudy = async () => {
    try {
      const { data } = await instance.get(endpoint.learningSet.getById, {
        params: {
          id: id,
        },
      });
      if (!data) {
        return;
      }
      router.push(`/flashcards/studying/${data.id}/quiz`);
    } catch (error) {
      handleErrorWithToast(error);
    }
  };
  useEffect(() => {
    if (learningSetData) {
      router.prefetch(`/flashcards/studying/${learningSetData.id}/quiz`);
    }
  }, [learningSetData]);
  return (
    learningSetData && (
      <div className="flex min-h-[100dvh] flex-col">
        <div className="mx-auto px-2 py-8 md:px-2 md:w-[700px] lg:w-[900px]">
          <div className="my-4">
            <h1 className="mb-4 text-2xl font-bold">
              Flashcards: {learningSetData.setFlashcardId?.title}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button className="w-full" variant="outline" onClick={handleStudy}>
              Luyện tập flashcard
            </Button>
            <Button variant="outline" onClick={handleRemoveLearningSet}>
              <Trash2 className="mr-2 h-4 w-4" />
              Dừng học bộ này
            </Button>
          </div>
          <p className="text-muted-foreground mb-4 font-medium">
            Bộ này có {learningFlashcardData.length} từ
          </p>
          <div className="flex flex-col gap-4 w-full">
            {learningFlashcardData.map((fc, index) => {
              return (
                <TrackingWordCard
                  learningFlashcard={fc}
                  key={fc.id}
                ></TrackingWordCard>
              );
            })}
          </div>
        </div>
        <StatusExplanationModal />
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn dừng học bộ này không?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn dữ
                liệu của bạn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleRemoveLearningSetConfirm();
                }}
              >
                Xác nhận dừng
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  );
}

export default TrackingFlashcardPage;
