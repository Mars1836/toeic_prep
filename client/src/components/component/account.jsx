"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useInput from "@/hooks/useInput";
import { useDispatch } from "react-redux";
import useFetch from "@/hooks/useFetch";
// import { endpoint } from "@/consts";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { setUserState } from "~lib/redux/userSlice";
import { useEndpoint } from "~components/wrapper/endpoint-context";

export function SignUp({ setShowSignUp }) {
  const { endpoint } = useEndpoint();
  const [showPassword, setShowPassword] = useState(false);
  const name = useInput();
  const email = useInput();
  const password = useInput();
  const router = useRouter();
  const { sendRequest } = useFetch({
    url: endpoint.auth.localSignupCache,
    method: "post",
    body: { email: email.value, name: name.value, password: password.value },
    onSuccess: (data) => {
      router.push(`/mail/verify?key=${data.key}&email=${email.value}`);
    },
  });
  function test() {
    router.push(`/mail/verify?key=${1}`);
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter your name"
          value={name.value}
          onChange={name.onChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email.value}
          onChange={email.onChange}
          required
        />
      </div>
      <div className="relative space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password.value}
          onChange={password.onChange}
          required
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1 h-7 w-7"
          onClick={() => setShowPassword(!showPassword)}
        >
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">Toggle password visibility</span>
        </Button>
      </div>
      <Button className="w-full" onClick={sendRequest}>
        Sign Up
      </Button>
      <div className="flex items-center justify-between">
        <Button variant="link" onClick={() => setShowSignUp(false)}>
          Đã có tài khoản? Đăng nhập
        </Button>
        <Link
          href="/account/forgot"
          className="text-sm underline"
          prefetch={false}
        >
          Quên mật khẩu?
        </Link>
      </div>
    </div>
  );
}
export function SignIn({ setShowSignUp }) {
  const { endpoint } = useEndpoint();
  console.log(endpoint);
  const email = useInput();
  const password = useInput();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const { sendRequest } = useFetch({
    url: endpoint.auth.login,
    method: "post",
    body: { email: email.value, password: password.value },
    onSuccess: (data) => {
      if (data.requiresEmailConfirmation) {
        toast.info(
          "Unusual login detected. Please check your email to verify your account."
        );
        router.push("/verify-login");
        return;
      }
      toast.success("Login successfull");
      // Login response có structure: { user: {...}, accessToken: "...", refreshToken: "..." }
      // Lấy user object từ response (cookies đã được set tự động bởi server)
      const userData = data.user || data; // Fallback nếu response structure khác
      dispatch(setUserState(formatUser(userData)));
      router.push(redirect ? redirect : "/");
    },
  });
  function setUpgradeStatus(upgradeExpiredDate) {
    if (!upgradeExpiredDate) return "FREE";
    return new Date() < new Date(upgradeExpiredDate) ? "UPGRADED" : "EXPIRED";
  }
  function formatUser(user) {
    console.log(new Date(user.upgradeExpiredDate));
    return {
      ...user,
      upgradeStatus: setUpgradeStatus(user.upgradeExpiredDate),
      isUpgraded: new Date() < new Date(user.upgradeExpiredDate),
    };
  }
  function login() {
    sendRequest();
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Enter your username"
          required
          value={email.value}
          onChange={email.onChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password.value}
          onChange={password.onChange}
          required
        />
      </div>
      <Button className="w-full" onClick={login}>
        Login
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full">
          <Link href={endpoint.auth.fbLogin} className="flex items-center">
            <FacebookIcon className="mr-2 h-4 w-4" />
            Facebook
          </Link>
        </Button>
        <Button variant="outline" className="w-full">
          <Link href={endpoint.auth.googleLogin} className="flex items-center">
            <ChromeIcon className="mr-2 h-4 w-4" />
            Google
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="link" onClick={() => setShowSignUp(true)}>
          Không có tài khoản? Đăng ký
        </Button>
        <Link
          href="/account/forgot"
          className="text-sm underline"
          prefetch={false}
        >
          Quên mật khẩu?
        </Link>
      </div>
    </div>
  );
}
export function Account() {
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-12 md:px-0 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-primary">
          Welcome to Toeic Journey
        </h1>
        <p className="text-muted-foreground">
          Đăng nhập để truy cập vào nguồn tài nguyên luyện thi TOEIC toàn diện
          của chúng tôi.
        </p>
      </div>
      {showSignUp ? (
        <SignUp setShowSignUp={setShowSignUp} />
      ) : (
        <SignIn setShowSignUp={setShowSignUp}></SignIn>
      )}
    </div>
  );
}

function ChromeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

function EyeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
