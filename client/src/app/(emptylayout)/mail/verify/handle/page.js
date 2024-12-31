"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifyEmailWaiting } from "@/components/verify-email-waiting";
import useFetch from "@/hooks/useFetch";
import { handleToastPromise } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useEndpoint } from "@/components/wrapper/endpoint-context";

function HandleVerifyMailPage() {
  const { endpoint } = useEndpoint();
  const searchParams = useSearchParams();
  const { sendRequest } = useFetch({
    url: endpoint.auth.requestVerifyEmail,
    method: "post",
    onSuccess: () => {
      window.location.replace(
        `/mail/verify?email=${searchParams.get("email")}`
      );
    },
    body: {
      otp: searchParams.get("otp"),
      email: searchParams.get("email"),
    },
  });

  useEffect(() => {
    sendRequest();
  }, []);
  return <div>HandleVerifyMailPage</div>;
}

export default HandleVerifyMailPage;

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
