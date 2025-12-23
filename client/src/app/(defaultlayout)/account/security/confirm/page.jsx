"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import instance from "@/configs/axios.instance";
import { toast } from "react-toastify";
import Link from "next/link";
import { useEndpoint } from "~components/wrapper/endpoint-context";

export default function ConfirmLoginPage() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get("tokenId");
  const router = useRouter();
  const { endpoint } = useEndpoint();
  
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Verifying your login...");

  useEffect(() => {
    if (!tokenId) {
      setStatus("error");
      setMessage("Invalid link: Missing token ID");
      return;
    }

    const confirmLogin = async () => {
      try {
        // Backend endpoint: POST /api/user/auth/security/confirm-login
        await instance.post(endpoint.auth.confirmLogin, {
          tokenId,
        });

        setStatus("success");
        setMessage("Login confirmed successfully! Redirecting...");
        toast.success("Login confirmed! You can now access your account.");
        
        // Force full page reload to refresh auth state
        setTimeout(() => {
            window.location.href = "/"; 
        }, 2000);

      } catch (error) {
        console.error("Confirmation error:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message || 
          "Failed to verify login. The link may be expired or invalid."
        );
      }
    };

    confirmLogin();
  }, [tokenId, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Security Verification</h1>
        
        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-green-600 font-medium">{message}</p>
             <p className="text-sm text-gray-500">Redirecting to home...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{message}</p>
            <div className="pt-4">
               <Link href="/login" className="text-primary hover:underline">
                  Back to Login
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
