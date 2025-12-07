
"use client"
import { AutumnProvider } from "autumn-js/react";
import React from "react";
import { useSession } from "@/lib/auth-client";

export default function CustomAutumnProvider({ children }: { children: React.ReactNode }) {
  const { data: session, refetch } = useSession();

  // Capture ?token=... from URL (after checkout redirect) and persist
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("bearer_token", token);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
      // Refresh auth session so user is considered signed in immediately
      Promise.resolve(refetch());
    }
  }, [refetch]);

  // Only enable Autumn tracking for authenticated users
  const getBearerToken = async () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("bearer_token");
    // Only return token if user has a valid session
    if (!token || !session?.user) return null;
    return token;
  };

  return (
    <AutumnProvider
      getBearerToken={getBearerToken}
    >
      {children}
    </AutumnProvider>
  );
}





