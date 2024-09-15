"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifyEmailWaiting } from "@/components/verify-email-waiting";
import { endpoint } from "@/consts";
import useCountdown from "@/hooks/useCountDown";
import useFetch from "@/hooks/useFetch";
import { handleToastPromise } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function VerifyMail() {
  const searchParams = useSearchParams();
  const [disabledBtn, setDisabledBtn] = useState(false);
  const user = useSelector((state) => state.user.data);
  const { time, startCountdown } = useCountdown({
    timeCD: 10,
    onEndTime: () => {
      setDisabledBtn(false);
    },
    onStart: () => {
      setDisabledBtn(true);
    },
  });
  const [firstSend, setFirstSend] = useState(true);
  const { request } = useFetch({
    url: endpoint.auth.sendVerifyEmail,
    method: "post",
    onSuccess: () => {},
    body: {
      key: searchParams.get("key"),
      email: searchParams.get("email"),
    },
  });
  function handleClick() {
    startCountdown();
    handleToastPromise(request);
    setFirstSend(false);
  }
  return (
    <div>
      {user ? (
        <div className="flex flex-col items-center justify-center h-screen bg-background">
          <Card className="w-full max-w-md p-6 sm:p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Email Verified
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="text-center mb-4">
                <CircleCheckIcon className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <p className="text-lg font-medium">
                  Your email has been verified!
                </p>
                <p className="text-muted-foreground">
                  You can now access all the features of our app.
                </p>
              </div>
              <Link href="/" className="w-full" prefetch={false}>
                <Button>Go to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-background">
          <Card className="w-full max-w-md p-6 sm:p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Email Verification Waiting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <MailIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
                <p className="text-lg font-medium">Verifying your email...</p>
                <p className="text-muted-foreground">
                  Please check your inbox for the verification email. Once you
                  confirm your email, you'll be able to access all the features
                  of our app.
                </p>
              </div>
              <Button
                variant="outline"
                disabled={disabledBtn}
                className="w-full"
                onClick={handleClick}
              >
                {firstSend
                  ? "Send Verification Email"
                  : time
                  ? `Resend Verification Email After ${time}s`
                  : `Resend Verification Email`}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default VerifyMail;

function MailIcon(props) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function CircleCheckIcon(props) {
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
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
