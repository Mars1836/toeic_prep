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

import { updateAvatar, updateProfile } from "@/lib/redux/userSlice";
import { toast } from "react-toastify";
import { originUrl } from "@/consts";
import { Loader2 } from "lucide-react";
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
import { useSelector, useDispatch } from "react-redux";
import useInput from "@/hooks/useInput";
async function blobUrlToBlob(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return blob;
}
export default function Component() {
  const user = useSelector((state) => state?.user?.data);
  const nameInput = useInput(user?.name || "");
  const bioInput = useInput(user?.bio || "");
  const [imgSrc, setImgSrc] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoadingAvatarUpdate, setIsLoadingAvatarUpdate] = useState(false);
  const [isLoadingProfileUpdate, setIsLoadingProfileUpdate] = useState(false);
  const dispatch = useDispatch();

  const handleUpdateProfile = async (e) => {
    const body = {
      name: nameInput.value,
      bio: bioInput.value,
    };
    try {
      setIsLoadingProfileUpdate(true);
      const { data } = await instance.post(
        endpoint.profile.updateProfile,
        body
      );

      dispatch(updateProfile(body));
      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      toast.error("Cập nhật hồ sơ thất bại");
    } finally {
      setIsLoadingProfileUpdate(false);
    }
  };
  useEffect(() => {
    nameInput.setInput(user?.name || "");
    bioInput.setInput(user?.bio || "");
  }, [user]);
  async function handleUpdateAvatar() {
    try {
      setIsLoadingAvatarUpdate(true);
      // Bước 1: Chuyển Blob URL thành Blob
      const blob = await blobUrlToBlob(imagePreview);

      // Bước 2: Tạo FormData để gửi lên server
      const formData = new FormData();
      formData.append("avatar", blob, "image.jpg"); // "image.jpg" là tên file

      const { data } = await instance.post(
        endpoint.profile.updateAvatar,
        formData
      );
      dispatch(updateAvatar(data));
      toast.success("Cập nhật avatar thành công");
      setImagePreview(null);
      setImgSrc(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Cập nhật avatar thất bại");
    } finally {
      setIsLoadingAvatarUpdate(false);
    }
  }
  useEffect(() => {
    console.log(imagePreview);
  }, [imagePreview]);
  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
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
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={imagePreview || originUrl + user.avatar}
                alt={user.name}
              />
              <AvatarFallback>
                {user.name
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
          {imagePreview && (
            <Button variant="default" onClick={handleUpdateAvatar}>
              {isLoadingAvatarUpdate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Lưu avatar"
              )}
            </Button>
          )}
          <div>
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              value={nameInput.value}
              onChange={nameInput.onChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              className="disabled:bg-gray-100"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="bio">Tiểu sử</Label>
            <Textarea
              id="bio"
              value={bioInput.value}
              onChange={bioInput.onChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleUpdateProfile}>
          {isLoadingProfileUpdate ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
