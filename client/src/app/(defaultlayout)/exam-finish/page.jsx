"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ExamFinish() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Hoàn thành bài thi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold">Chúc mừng!</h2>
            <p className="text-gray-600">
              Bạn đã hoàn thành bài thi TOEIC. Kết quả sẽ được gửi qua email của
              bạn.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full"
              variant="default"
            >
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
