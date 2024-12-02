"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import withAuth from "~HOC/withAuth";
import {
  BookOpenIcon,
  CalendarDays,
  CalendarIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  PlayIcon,
  PlusIcon,
  RefreshCw,
  Trash2,
  Trash2Icon,
  TrashIcon,
  User2,
} from "lucide-react";
import { CreateFlashcardSetModal } from "@/components/modal/create-flashcard-set-modal";
import instance from "~configs/axios.instance";
import { endpoint, RATE_LIMIT } from "~consts";
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
import { formatDate, handleErrorWithToast } from "~helper";
import { FlashcardSetSelectorComponent } from "@/components/modal/flashcard-set-selector";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Badge } from "~components/ui/badge";
function StudyingPage() {
  const [setData, setSetData] = useState();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [learningSetIdFocused, setLearningSetIdFocused] = useState();
  const router = useRouter();
  function goToTrackingSet(id) {
    router.push(`/flashcards/studying/${id}/tracking`);
  }
  function handleRemoveLearningSet(id) {
    setLearningSetIdFocused(id);
    setIsAlertOpen(true);
  }
  async function handleRemoveLearningSetConfirm() {
    try {
      const { data } = await instance.delete(
        endpoint.learningSet.removeSetFromLearn,
        {
          data: {
            learningSetId: learningSetIdFocused,
          },
        }
      );
      if (data) {
        toast.success("Xóa thành công");
        setSetData((pre) => {
          return pre.filter((item) => item.id !== learningSetIdFocused);
        });
      }
      setIsAlertOpen(false);
    } catch (error) {
      handleErrorWithToast(error);
    }
  }
  useEffect(() => {
    async function fetchSetData() {
      const { data } = await instance.get(endpoint.learningSet.getByUser);
      // const setFlashcards = data.map((item) => {
      //   return item.setFlashcardId;
      // });
      setSetData(data);
    }
    fetchSetData();
  }, []);
  useEffect(() => {
    if (setData && setData.length > 0) {
      setData.forEach((item) => {
        router.prefetch(`/flashcards/studying/${item.id}`);
      });
    }
  }, [setData]);
  return (
    setData && (
      <div>
        <div className="flex min-h-[100dvh] flex-col">
          <main className="container mx-auto flex-1 px-4 py-8 md:px-6">
            <div className="grid gap-6">
              <section>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <Card className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Words Learned</h3>
                      <CircleCheckIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-4xl font-bold">1,234</p>
                    <p className="text-muted-foreground">
                      You've learned 1,234 words so far.
                    </p>
                  </Card>
                  <Card className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Words Remembered
                      </h3>
                      <CircleCheckIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-4xl font-bold">987</p>
                    <p className="text-muted-foreground">
                      You remember 987 words from your studies.
                    </p>
                  </Card>
                  <Card className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Words to Review</h3>
                      <CircleAlertIcon className="h-6 w-6 text-yellow-500" />
                    </div>
                    <p className="text-4xl font-bold">247</p>
                    <p className="text-muted-foreground">
                      You have 247 words that need reviewing.
                    </p>
                  </Card>
                </div>
              </section>
              {/* <section>
                <CreateFlashcardSetModal
                  setFC={setData}
                  setSetFC={setSetData}
                ></CreateFlashcardSetModal>
                <FlashcardSetSelectorComponent />
              </section> */}

              <section>
                <h2 className="mb-4 text-2xl font-bold">
                  Flashcard Categories
                </h2>
                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {setData.map((item) => {
                    return (
                      <Card className="flex flex-col gap-2 p-4" key={item.id}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {item.setFlashcardId.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                handleRemoveLearningSet(item.id);
                              }}
                            >
                              <Trash2Icon className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {item.setFlashcardId.description}
                        </p>

                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User2 className="w-4 h-4" />
                          <span>Người tạo: Hau vu</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CalendarDays className="w-4 h-4" />
                          <span>Ngày tạo: {formatDate(item.createdAt)}</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm">
                            {item.setFlashcardId.numberOfFlashcards} flashcards
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              goToTrackingSet(item.id);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div> */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {setData.map((item) => {
                    return (
                      <Card
                        key={item.id}
                        className="flex flex-col hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl font-semibold">
                                {item.setFlashcardId.title}
                              </CardTitle>
                              <CardDescription className="text-sm text-muted-foreground mt-1">
                                {item.setFlashcardId.description}
                              </CardDescription>
                            </div>
                            {item.learningFlashcards.filter((x) => {
                              return x < RATE_LIMIT && x !== RATE_LIMIT;
                            }).length > 0 && (
                              <Badge
                                variant="destructive"
                                className="text-sm font-medium bg-red-500 text-white"
                              >
                                {
                                  item.learningFlashcards.filter((x) => {
                                    return x < RATE_LIMIT && x !== RATE_LIMIT;
                                  }).length
                                }{" "}
                                to review
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <BookOpenIcon className="mr-2 h-4 w-4 text-muted-foreground " />
                              <span>
                                {item.setFlashcardId.numberOfFlashcards}{" "}
                                flashcards
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>
                                Created on {formatDate(item.createdAt)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-4 border-t">
                          <Button
                            onClick={() => goToTrackingSet(item.id)}
                            className="flex-1 mr-2 bg-green-500 hover:bg-green-600 text-white"
                          >
                            <PlayIcon className="mr-2 h-4 w-4" />
                            Tracking
                          </Button>
                          <Button
                            onClick={() => handleRemoveLearningSet(item.id)}
                            variant="outline"
                            className="flex-1 ml-2 border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </section>
            </div>
          </main>
        </div>
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
              <AlertDialogAction
                onClick={() => {
                  handleRemoveLearningSetConfirm();
                }}
              >
                Xác nhận xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  );
}

export default withAuth(StudyingPage);
