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
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { RATE_LIMIT } from "~consts";
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
import { Loader2 } from "lucide-react";
function StudyingPage() {
  const { endpoint } = useEndpoint();
  const [loadingStudying, setLoadingStudying] = useState(true);
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
      setLoadingStudying(false);
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
  return loadingStudying ? (
    <div className="flex justify-center items-center w-full mt-10">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    setData && (
      <div>
        <div className="flex min-h-[100dvh] flex-col">
          <main className="container mx-auto flex-1 px-4 py-8 md:px-6">
            <div className="grid gap-6">
              {/* <section>
                <CreateFlashcardSetModal
                  setFC={setData}
                  setSetFC={setSetData}
                ></CreateFlashcardSetModal>
                <FlashcardSetSelectorComponent />
              </section> */}

              <section>
                <h2 className="mb-4 text-2xl font-bold">
                  Danh sách flashcard đang học
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                  {setData && setData.length > 0 ? (
                    setData.map((item) => {
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
                          <CardFooter className="grid grid-cols-2 justify-between pt-4 border-t gap-2">
                            <Button
                              onClick={() => goToTrackingSet(item.id)}
                              className=" w-full bg-primary hover:bg-primary/90 text-white"
                            >
                              <PlayIcon className="mr-2 h-4 w-4" />
                              Theo dõi
                            </Button>

                            <Button
                              onClick={() => handleRemoveLearningSet(item.id)}
                              variant="outline"
                              className=" w-full border-red-500 text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Xóa
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="">
                      <p className="text-muted-foreground">
                        Bạn chưa học set flashcard nào
                      </p>
                    </div>
                  )}
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
