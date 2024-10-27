"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleAlertIcon, CircleCheckIcon, PlusIcon } from "lucide-react";
import { CreateFlashcardModal } from "@/components/modal/create-flashcard-modal";
import { CreateFlashcardSetModal } from "@/components/modal/create-flashcard-set-modal";
import { listOfSetFlashCard } from "@/dbTest/flashcard";
function FlashcartsPage() {
  return (
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
                    <h3 className="text-lg font-semibold">Words Remembered</h3>
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
            <section>
              <CreateFlashcardSetModal></CreateFlashcardSetModal>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">Flashcard Categories</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {listOfSetFlashCard.map((item) => {
                  return (
                    <Card className="flex flex-col gap-2 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Link
                          href={`/flashcards/set/${item.id}`}
                          className="text-primary hover:underline"
                          prefetch={false}
                        >
                          View
                        </Link>
                      </div>
                      <p className="text-muted-foreground">{item.detail}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm">120 flashcards</span>
                        <Button variant="outline" size="sm">
                          Study
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
export default FlashcartsPage;
