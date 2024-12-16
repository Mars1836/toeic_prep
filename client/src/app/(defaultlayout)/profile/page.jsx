"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PencilIcon, BarChart2Icon } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import instance from "~configs/axios.instance";
import { endpoint, originUrl } from "~consts";
import ProfileTargetScore from "@/components/component/profile_target_score";
export default function Profile() {
  const router = useRouter();
  const user = useSelector((state) => state.user.data);
  const [readScore, setReadScore] = useState(0);
  const [listenScore, setListenScore] = useState(0);
  const [score, setScore] = useState(0);
  const goToAnalysisPage = () => {
    router.push("/profile/analysis");
  };
  const goToEditProfilePage = () => {
    router.push("/profile/edit");
  };
  const goToHistoryPage = () => {
    router.push("/result");
  };
  useEffect(() => {
    const fetchDataAnalysis = async () => {
      try {
        const { data } = await instance.get(endpoint.profile.getAnalysis);
        if (!data) return;

        setReadScore(data.readScore);
        setListenScore(data.listenScore);
        setScore(data.score);
      } catch (error) {
        handleErrorWithToast(error);
      }
    };
    fetchDataAnalysis();
  }, []);
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24  font-bold text-primary text-2xl">
            <AvatarImage src={originUrl + user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Email
              </h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Membership
              </h3>
              <p>{user.upgradeStatus === "UPGRADED" ? "Premium" : "Free"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Tests Taken
              </h3>
              <p>15</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Average Score
              </h3>
              <p>750</p>
            </div>
          </div>
          <div>
            <ProfileTargetScore
              currentScores={{ reading: readScore, listening: listenScore }}
              targetScores={{
                reading: user.targetScore.reading || 495,
                listening: user.targetScore.listening || 495,
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goToEditProfilePage}>
            <PencilIcon className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          <div className="flex gap-2">
            <Button onClick={goToHistoryPage}>
              <HistoryIcon className="mr-2 h-4 w-4" /> Lịch sử thi
            </Button>
            <Button onClick={goToAnalysisPage}>
              <BarChart2Icon className="mr-2 h-4 w-4" /> Phân tích kết quả thi
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
