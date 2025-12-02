"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

type AuthMode = "login" | "register";
type UserType = "guest" | "owner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
  defaultType?: UserType;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
  defaultType = "guest",
}: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [userType, setUserType] = useState<UserType>(defaultType);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  useEffect(() => {
    setMode(defaultMode);
    setUserType(defaultType);
  }, [defaultMode, defaultType]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: loginEmail,
        password: loginPassword,
        rememberMe,
      });

      if (error) {
        toast.error("Invalid email or password");
        return;
      }

      // Verify user role if owner login
      if (userType === "owner" && data?.user) {
        const userResponse = await fetch("/api/user/profile");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.role !== "owner" && userData.role !== "admin") {
            toast.error("This login is for property owners only");
            await authClient.signOut();
            return;
          }
          toast.success("Welcome back!");
          onClose();
          router.push("/owner/dashboard");
          return;
        }
      }

      toast.success("Welcome back!");
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    setIsLoading(true);

    try {
      // Sign out if already logged in
      const sessionRes = await authClient.getSession();
      if (sessionRes?.data) {
        await authClient.signOut();
      }

      // Register using better-auth
      const { data, error } = await authClient.signUp.email({
        email: registerEmail,
        name: registerName,
        password: registerPassword,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      // If owner registration, set role and additional fields
      if (userType === "owner" && data?.user) {
        const completeResponse = await fetch("/api/owner/complete-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.user.id,
            role: "owner",
          }),
        });

        if (!completeResponse.ok) {
          console.error("Failed to set owner role");
        }
      }

      // Send verification email
      try {
        await fetch("/api/auth/send-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: registerEmail,
            userId: data?.user?.id,
          }),
        });
      } catch (err) {
        console.error("Failed to send verification email:", err);
      }

      toast.success("Account created! Please check your email to verify your account.");
      
      // Switch to login mode
      setMode("login");
      setLoginEmail(registerEmail);
      setLoginPassword("");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {mode === "login" ? "Sign In to your Account" : "Registration"}
          </h2>

          {/* User Type Tabs */}
          <div className="flex gap-8 mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setUserType("guest")}
              className={`pb-3 px-1 text-base font-medium transition-colors relative ${
                userType === "guest"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Guest
              {userType === "guest" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setUserType("owner")}
              className={`pb-3 px-1 text-base font-medium transition-colors relative ${
                userType === "owner"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Owner
              {userType === "owner" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          </div>

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address.."
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-full border border-gray-300 focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8] text-sm"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password.."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-full border border-gray-300 focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8] text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label htmlFor="remember" className="text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-gray-600 hover:text-gray-900 underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 pt-2">
                Don't have an account?{" "}
                {userType === "owner" ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/owner/register");
                    }}
                    className="text-[#17a2b8] hover:text-[#138496] font-medium underline"
                  >
                    Create an Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-[#17a2b8] hover:text-[#138496] font-medium underline"
                  >
                    Create an Account
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full h-12 px-4 rounded-full border border-gray-300 focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8] text-sm"
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-full border border-gray-300 focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8] text-sm"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-full border border-gray-300 focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8] text-sm"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Repeat password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-full border border-gray-300 focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8] text-sm"
                  required
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-600">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="cursor-pointer leading-tight">
                  By clicking "Create account", an account will be created for you. You must agree to our{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/terms")}
                    className="text-[#17a2b8] hover:underline"
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/privacy")}
                    className="text-[#17a2b8] hover:underline"
                  >
                    Privacy Policy
                  </button>{" "}
                  before you can continue.
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[#17a2b8] hover:text-[#138496] font-medium underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
