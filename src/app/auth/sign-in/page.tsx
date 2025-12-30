"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, Lock, Shield } from "lucide-react";
import Link from "next/link";

type Step = "email" | "otp" | "password" | "complete";

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");

  // Step 1: Enter Email and Request OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Send OTP via Resend
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationId(data.verificationId);
        setStep("otp");
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(data.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Email submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code: otp,
          verificationId 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresPassword) {
          setStep("password");
          toast.success("Code verified! Please enter your password.");
        } else {
          // Auto-login (for new users without password)
          await handleAutoLogin();
        }
      } else {
        toast.error(data.error || "Invalid verification code");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Enter Password and Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with email + password
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error("Invalid password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success! Redirect to properties page (public site)
      // Note: Admin/Owner users should use dedicated login pages
      toast.success("Welcome back!");
      setStep("complete");

      setTimeout(() => {
        router.push("/properties");
      }, 500);
    } catch (error) {
      console.error("Password submission error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Auto-login for verified users without password
  const handleAutoLogin = async () => {
    try {
      // Create session token
      const response = await fetch("/api/auth/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Successfully signed in!");
        setStep("complete");
        setTimeout(() => router.push("/"), 500);
      } else {
        setStep("password");
        toast.info("Please set a password to continue");
      }
    } catch (error) {
      console.error("Auto-login error:", error);
      setStep("password");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("New verification code sent!");
      } else {
        toast.error("Failed to resend code");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#89A38F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {step === "email" && "Sign In"}
              {step === "otp" && "Verify Your Email"}
              {step === "password" && "Enter Password"}
              {step === "complete" && "Welcome!"}
            </h1>
            <p className="text-sm text-gray-600">
              {step === "email" && "Enter your email to continue"}
              {step === "otp" && "We sent a 6-digit code to your email"}
              {step === "password" && "Enter your password to sign in"}
              {step === "complete" && "Redirecting you now..."}
            </p>
          </div>

          {/* Step 1: Email Input */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#89A38F] focus:border-transparent"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* CAPTCHA Placeholder */}
              <div id="clerk-captcha" className="h-20 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">CAPTCHA Verification (Optional)</span>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#89A38F] hover:bg-[#7a9280] text-white rounded-xl font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Continue with Email"
                )}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#89A38F] text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  required
                  autoComplete="one-time-code"
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Sent to {email}
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 bg-[#89A38F] hover:bg-[#7a9280] text-white rounded-xl font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="w-full text-sm text-[#89A38F] hover:text-[#7a9280] font-medium transition-colors"
              >
                Didn't receive the code? Resend
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Change Email
              </button>
            </form>
          )}

          {/* Step 3: Password Input */}
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-[#89A38F] focus:border-transparent"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#89A38F] hover:bg-[#7a9280] text-white rounded-xl font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Link
                href="/forgot-password"
                className="block text-center text-sm text-[#89A38F] hover:text-[#7a9280] font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </form>
          )}

          {/* Step 4: Complete */}
          {step === "complete" && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-[#89A38F] animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Taking you to your dashboard...</p>
            </div>
          )}

          {/* Footer */}
          {step !== "complete" && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#89A38F] hover:text-[#7a9280] font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
