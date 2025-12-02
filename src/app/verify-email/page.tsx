"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        toast.success("Email verified! You can now log in.");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Verification failed");
        toast.error("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage("An error occurred during verification");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-[#17a2b8] animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h1>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full px-8"
            >
              Continue to Login
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full px-8"
            >
              Back to Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#17a2b8]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
