"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TargetScoreModal({ currentTargets, onUpdate }) {
  const [reading, setReading] = useState(currentTargets?.reading || "");
  const [listening, setListening] = useState(currentTargets?.listening || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(reading, listening);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Cập nhật mục tiêu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật điểm mục tiêu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reading">Điểm Reading mục tiêu</Label>
            <Input
              id="reading"
              type="number"
              min="0"
              max="495"
              value={reading}
              onChange={(e) => setReading(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="listening">Điểm Listening mục tiêu</Label>
            <Input
              id="listening"
              type="number"
              min="0"
              max="495"
              value={listening}
              onChange={(e) => setListening(Number(e.target.value))}
            />
          </div>
          <Button type="submit">Lưu thay đổi</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
