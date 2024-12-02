"use client";
import React, { useState } from "react";
import {
  getDaysInMonth,
  getMonthName,
  getTodayDate,
} from "../../utils/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Sample review data
const reviewData = {
  [getTodayDate().toISOString().split("T")[0]]: [
    {
      setFlashcard: "Vocabulary for Daily Life",
      wordToReview: ["apple", "bicycle", "garden", "house", "school"],
    },
    {
      setFlashcard: "Business English",
      wordToReview: ["meeting", "presentation", "deadline", "client", "profit"],
    },
    {
      setFlashcard: "Travel English",
      wordToReview: ["airport", "ticket", "passport", "hotel", "luggage"],
    },
  ],
  "2023-11-10": [
    {
      setFlashcard: "Advanced Vocabulary",
      wordToReview: [
        "eloquent",
        "ubiquitous",
        "ephemeral",
        "serendipity",
        "perseverance",
      ],
    },
  ],
};

export function ReviewCalendar() {
  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const today = getTodayDate();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const hasWordToReview = (date) => {
    return reviewData[formatDate(date)] !== undefined;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
        </CardTitle>
        <div className="space-x-2">
          <Button onClick={prevMonth} variant="outline" size="icon">
            &lt;
          </Button>
          <Button onClick={nextMonth} variant="outline" size="icon">
            &gt;
          </Button>
          <Button onClick={goToToday} variant="outline">
            Today
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <Button
              key={index}
              variant={
                selectedDate &&
                day.toDateString() === selectedDate.toDateString()
                  ? "default"
                  : "outline"
              }
              className={`h-10 ${
                hasWordToReview(day) ? "bg-green-100 hover:bg-green-200" : ""
              }`}
              onClick={() => setSelectedDate(day)}
            >
              {day.getDate()}
            </Button>
          ))}
        </div>
        {selectedDate && (
          <div className="mt-4">
            <p className="font-bold text-center">
              {selectedDate.toDateString()}
            </p>
            {hasWordToReview(selectedDate) ? (
              reviewData[formatDate(selectedDate)].map((set, index) => (
                <div key={index} className="mt-2">
                  <h3 className="font-semibold">{set.setFlashcard}</h3>
                  <p>Words to review: {set.wordToReview.join(", ")}</p>
                </div>
              ))
            ) : (
              <p className="text-center">No words to review today</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
