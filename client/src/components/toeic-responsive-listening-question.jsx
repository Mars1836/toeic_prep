"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, PauseCircle, Menu, Clock, Grid } from "lucide-react";

export function ToeicResponsiveListeningQuestion() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">Toeic Journey</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Resources
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Practice Tests
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                TOEIC Full Exam
              </a>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <a href="#" className="text-lg font-medium">
                    About
                  </a>
                  <a href="#" className="text-lg font-medium">
                    Resources
                  </a>
                  <a href="#" className="text-lg font-medium">
                    Practice Tests
                  </a>
                  <a href="#" className="text-lg font-medium">
                    Contact
                  </a>
                  <a href="#" className="text-lg font-medium">
                    TOEIC Full Exam
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-2/3">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Listening Comprehension
                </h2>
                <p className="text-sm mb-6">
                  Look at the picture and listen to the sentences. Choose the
                  option that best describes the image.
                </p>

                {/* Audio Player */}
                <div className="mb-6 flex items-center justify-between">
                  <Button variant="outline" size="icon" onClick={togglePlay}>
                    {isPlaying ? (
                      <PauseCircle className="h-6 w-6" />
                    ) : (
                      <PlayCircle className="h-6 w-6" />
                    )}
                  </Button>
                  <span className="text-lg">{currentTime}</span>
                </div>

                {/* Image */}
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Woman sitting at an outdoor café, looking thoughtfully at a menu"
                  className="w-full mb-6 rounded-md"
                />

                {/* Multiple Choice Options */}
                <div className="space-y-4 mb-6">
                  {["A", "B", "C", "D"].map((option, index) => (
                    <div key={option} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={`option-${option}`}
                        name="answer"
                        className="form-radio h-5 w-5"
                      />
                      <label htmlFor={`option-${option}`} className="text-lg">
                        {option}){" "}
                        {
                          [
                            "The man is finishing his meal.",
                            "The customer is waiting for a table.",
                            "The waiter is setting the table.",
                            "The woman is looking at the menu.",
                          ][index]
                        }
                      </label>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <Button className="w-full text-lg py-6">Submit Answer</Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar for PC */}
          <div className="hidden lg:block lg:w-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Question Navigator</h3>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="text-lg font-medium">05:22</span>
                  </div>
                </div>
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                      <Button
                        key={num}
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 text-lg"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden bg-white shadow-sm fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around h-16">
            <Button
              variant="ghost"
              size="icon"
              className="flex flex-col items-center justify-center"
            >
              <Clock className="h-5 w-5" />
              <span className="text-xs">05:22</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex flex-col items-center justify-center"
                >
                  <Grid className="h-5 w-5" />
                  <span className="text-xs">Questions</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Question Navigator
                  </h3>
                  <ScrollArea className="h-[calc(80vh-8rem)]">
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 100 }, (_, i) => i + 1).map(
                        (num) => (
                          <Button
                            key={num}
                            variant="outline"
                            size="sm"
                            className="h-10 w-10"
                          >
                            {num}
                          </Button>
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}
