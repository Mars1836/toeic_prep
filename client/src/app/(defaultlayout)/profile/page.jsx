"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, BarChart2 } from "lucide-react";
import {
  CalendarDays,
  MapPin,
  Link as LinkIcon,
  MailT,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
export default function Profile({
  name = "Jane Doe",
  username = "janedoe",
  bio = "UX Designer and front-end developer. Passionate about creating intuitive and beautiful user experiences.",
  location = "San Francisco, CA",
  website = "https://janedoe.com",
  email = "jane@example.com",
  twitter = "@janedoe",
  joinDate = "2023-01-15",
  avatarUrl = "/placeholder.svg?height=128&width=128",
  backgroundUrl = "/images/bg.jpg",
}) {
  const router = useRouter();
  const goToAnalysisPage = () => {
    router.push("/profile/analysis");
  };
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="p-0">
        <div className="h-48 overflow-hidden">
          <img
            src={"/images/bg.jpg"}
            alt="Profile background"
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="relative pt-16 px-4 sm:px-6">
        <Avatar className="absolute -top-16 left-4 sm:left-6 w-32 h-32 border-4 border-background">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <CardTitle className="text-2xl font-bold">{name}</CardTitle>
            <CardDescription>@{username}</CardDescription>
          </div>
          <Button
            className="mt-2 sm:mt-0"
            onClick={() => router.push("/profile/edit")}
          >
            Edit Profile
          </Button>
        </div>
        <p className="text-muted-foreground mb-4">{bio}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center">
            <LinkIcon className="w-4 h-4 mr-2 text-muted-foreground" />
            <a href={website} className="text-sm text-blue-500 hover:underline">
              {website}
            </a>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            <a
              href={`mailto:${email}`}
              className="text-sm text-blue-500 hover:underline"
            >
              {email}
            </a>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>
            Joined{" "}
            {new Date(joinDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          className="w-full sm:w-auto"
          onClick={() => console.log("View exam history")}
        >
          <History className="mr-2 h-4 w-4" />
          Xem lịch sử thi
        </Button>
        <Button className="w-full sm:w-auto" onClick={goToAnalysisPage}>
          <BarChart2 className="mr-2 h-4 w-4" />
          Phân tích kết quả thi
        </Button>
      </CardFooter>
    </Card>
  );
}
