"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { endpoint } from "@/consts";
import useCountdown from "@/hooks/useCountDown";
import useFetch from "@/hooks/useFetch";
import useInput from "@/hooks/useInput";
import { handleErrorPromiseToast, handleToastPromise } from "@/lib/utils";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function ForgetPage() {
  const email = useInput();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const router = useRouter();

  const { request, errors } = useFetch({
    url: endpoint.auth.sendResetPwEmail,
    method: "post",
    body: { email: email.value },
    onSuccess: () => {
      console.log("asd");
    },
    onFailed: () => {},
  });
  const { time, startCountdown } = useCountdown({
    timeCD: 10,
    onEndTime() {
      setBtnDisabled(false);
    },
    onStart() {
      setBtnDisabled(true);
    },
  });
  useEffect(() => {});
  function handleSubmit() {
    startCountdown();
    handleToastPromise(request);
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-20 text-lg px-6 lg:px:0">
      <h1 className="text-center text-2xl">Đặt lại mật khẩu</h1>

      <Button
        variant="outline"
        className="px-4 py-2 text-lg transition-colors duration-200 ease-in-out hover:bg-gray-200"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Go back
      </Button>
      <p>
        Hãy điền email của bạn. Bạn sẽ nhận được một đường dẫn để tạo mật khẩu
        mới trong email
      </p>
      <Input
        id="email"
        placeholder="Enter your email"
        className="text-lg p-4 py-6"
        required
        value={email.value}
        onChange={email.onChange}
      ></Input>
      <Button className="" onClick={handleSubmit} disabled={btnDisabled}>
        Submit
      </Button>
      {btnDisabled && (
        <p>Please re-send after {time} seconds if you do not get the email.</p>
      )}
    </div>
  );
}

export default ForgetPage;
