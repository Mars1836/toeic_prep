"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CropImage from "@/components/component/crop_Image";
import { endpoint } from "@/consts";
import instance from "~configs/axios.instance";
async function blobUrlToBlob(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return blob;
}
export default function Component() {
  const [profile, setProfile] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    bio: "Học viên TOEIC đầy nhiệt huyết",
    avatarUrl: "/placeholder.svg?height=128&width=128",
  });

  const [upImg, setUpImg] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 100, aspect: 1 });
  const [imgSrc, setImgSrc] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý lưu thông tin hồ sơ và ảnh đã cắt ở đây
    uploadImage();
    // Sau khi lưu, bạn có thể chuyển hướng người dùng hoặc hiển thị thông báo thành công
  };
  async function uploadImage() {
    try {
      // Bước 1: Chuyển Blob URL thành Blob
      const blob = await blobUrlToBlob(imagePreview);

      // Bước 2: Tạo FormData để gửi lên server
      const formData = new FormData();
      formData.append("avatar", blob, "image.jpg"); // "image.jpg" là tên file
      const { data } = await instance.post(
        endpoint.profile.updateProfile,
        formData
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
  useEffect(() => {
    console.log(imagePreview);
  }, [imagePreview]);
  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Chỉnh sửa hồ sơ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={imagePreview || profile.avatarUrl}
                  alt={profile.name}
                />
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-2 rounded-md">
                    <Camera className="w-4 h-4" />
                    <span>Thay đổi ảnh đại diện</span>
                  </div>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onSelectFile}
                />
              </div>
            </div>
            <CropImage setImagePreviewRef={setImagePreview} imgSrc={imgSrc} />
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="bio">Tiểu sử</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit}>
          Lưu thay đổi
        </Button>
      </CardFooter>
    </Card>
  );
}
