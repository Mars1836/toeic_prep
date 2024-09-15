"use client";
import { ChangePassword } from "@/components/change-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { endpoint } from "@/consts";
import useFetch from "@/hooks/useFetch";
import useInput from "@/hooks/useInput";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
function PasswordChangePage() {
  const password = useInput();
  const cfPassword = useInput();
  const searchParams = useSearchParams();
  const { sendRequest } = useFetch({
    url: endpoint.auth.requestResetPw,
    method: "post",
    body: {
      password: password.value,
      otp: searchParams.get("otp"),
      email: searchParams.get("email"),
    },
    onSuccess: () => {
      toast.success("Change password success");
      window.location.replace("/");
    },
  });

  const handleClick = () => {
    if (password.value !== cfPassword.value) {
      toast.error(
        "Passwords do not match. Please ensure both password fields are identical "
      );
      return;
    }
    sendRequest();
  };
  return (
    <div className="min-h-screen flex items-center">
      <div className="mx-auto max-w-md space-y-6">
        <Link href="/">
          <Button
            variant="outline"
            className="px-4 py-2 text-lg transition-colors duration-200 ease-in-out hover:bg-gray-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go back
          </Button>
        </Link>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Change Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below to reset your account password.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              required
              value={password.value}
              onChange={password.onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              required
              value={cfPassword.value}
              onChange={cfPassword.onChange}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleClick}>
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PasswordChangePage;
