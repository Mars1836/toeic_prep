"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TargetScoreModal } from "@/components/modal/update-target-score-modal";
import instance from "~configs/axios.instance";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { updateTargetScore } from "~lib/redux/userSlice";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";

export default function ProfileTargetScore({ targetScores, currentScores }) {
  const dispatch = useDispatch();
  const { endpoint } = useEndpoint();
  const handleUpdateTargets = async (reading, listening) => {
    try {
      const { data } = await instance.post(endpoint.profile.updateTargetScore, {
        reading,
        listening,
      });
      if (data) {
        dispatch(updateTargetScore({ reading, listening }));
        toast.success("Cập nhật điểm mục tiêu thành công");
      }
    } catch (error) {
      console.error("Failed to update target scores:", error);
    }
  };
  return (
    <div className="space-y-6">
      {/* Existing profile content */}
      <div>
        <div className="">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Điểm mục tiêu</h3>
            <TargetScoreModal
              currentTargets={targetScores}
              onUpdate={handleUpdateTargets}
            />
          </div>
          {targetScores ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Reading Target / Reading Current
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{currentScores.reading}</p>
                  <p className="text-sm text-muted-foreground mb-1">
                    /{targetScores.reading}
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${
                        targetScores.reading
                          ? (currentScores.reading / targetScores.reading) * 100
                          : 0
                      }%`,
                      maxWidth: "100%",
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Listening Target / Listening Current
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">
                    {currentScores.listening}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    /{targetScores.listening}
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${
                        targetScores.listening
                          ? (currentScores.listening / targetScores.listening) *
                            100
                          : 0
                      }%`,
                      maxWidth: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Reading Current</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{currentScores.reading}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Listening Current
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">
                    {currentScores.listening}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
