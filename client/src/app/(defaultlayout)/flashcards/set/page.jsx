"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import withAuth from "../../../../HOC/withAuth";
import {
  CalendarDays,
  CircleAlertIcon,
  CircleCheckIcon,
  PlusIcon,
  RefreshCw,
  Trash2,
  User2,
} from "lucide-react";
import { CreateFlashcardSetModal } from "@/components/modal/create-flashcard-set-modal";
import instance from "~configs/axios.instance";
import { MoreVertical } from "lucide-react";
import { UpdateFlashcardSetModal } from "@/components/modal/update-flashcard-set-modal";
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
import { formatDate } from "~helper";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
function FlashcartsPage() {
  const { endpoint } = useEndpoint();
  const [setData, setSetData] = useState();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [setFCFocused, setSetFCFocused] = useState();
  const router = useRouter();
  const handleUpdate = (setFCFocused) => {
    setSetFCFocused(setFCFocused);
    setIsUpdateDialogOpen(true);
  };

  const handleRemove = (setFCFocused) => {
    setIsAlertOpen(true);
    setSetFCFocused(setFCFocused);
  };

  const confirmRemove = async () => {
    const rs = await instance.delete(endpoint.setFlashcard.delete, {
      data: {
        id: setFCFocused.id,
      },
    });
    if (rs.status === 200) {
      toast.success("Xóa thành công");
      setSetData((pre) => {
        return pre.filter((item) => {
          return item.id !== setFCFocused.id;
        });
      });
      setIsAlertOpen(false);
    }
  };
  function goToView(id) {
    router.push(`/flashcards/set/${id}`);
  }
  useEffect(() => {
    async function fetchSetData() {
      const { data } = await instance.get(endpoint.setFlashcard.getByUser);
      setSetData(data);
    }
    fetchSetData();
  }, []);
  useEffect(() => {
    if (setData && setData.length > 0) {
      setData.forEach((item) => {
        router.prefetch(`/flashcards/set/${item.id}`);
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
                <CreateFlashcardSetModal
                  setFC={setData}
                  setSetFC={setSetData}
                ></CreateFlashcardSetModal>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">
                  Flashcard Categories
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {setData && setData.length > 0 ? (
                    setData.map((item) => {
                      return (
                        <Card className="flex flex-col gap-2 p-4" key={item.id}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              {item.title}
                            </h3>
                            <div className="">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handleUpdate(item);
                                    }}
                                  >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    <span>Update</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handleRemove(item);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Remove</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User2 className="w-4 h-4" />
                            <span>Người tạo: hauvu</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <CalendarDays className="w-4 h-4" />
                            <span>Created: {formatDate(item.createdAt)}</span>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-sm">
                              {item.numberOfFlashcards} flashcards
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                goToView(item.id);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="">
                      <p className="text-muted-foreground">
                        Bạn chưa có set flashcard nào
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
                  confirmRemove();
                }}
              >
                Xác nhận xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {setFCFocused && (
          <UpdateFlashcardSetModal
            setFCFocused={setFCFocused}
            setSetFC={setSetData}
            open={isUpdateDialogOpen}
            setOpen={setIsUpdateDialogOpen}
          ></UpdateFlashcardSetModal>
        )}
      </div>
    )
  );
}

export default withAuth(FlashcartsPage);
