"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

import { clearAuthTokenProvider, setAuthTokenProvider } from "@/lib/api";

/**
 * Bridges Clerk auth -> `frontend/lib/api.ts` so backend protected routes work.
 */
export default function ApiAuthProvider() {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    setAuthTokenProvider(async () => {
      try {
        return (await getToken()) ?? null;
      } catch {
        return null;
      }
    });

    return () => {
      clearAuthTokenProvider();
    };
  }, [getToken, isLoaded]);

  return null;
}
