"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (error.name === "StravaAuthError") {
      signOut({ callbackUrl: "/" });
    }
  }, [error]);

  if (error.name === "StravaAuthError") return null;

  const isRateLimit = error.name === "StravaRateLimitError";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-gray-500 mb-4">
        {isRateLimit
          ? `Strava rate limit reached. Please wait a moment and try again.${process.env.NODE_ENV === "development" ? ` ${error.message}` : ""}`
          : "Unable to load your Strava data. Please try again."}
      </p>
      {process.env.NODE_ENV === "development" && !isRateLimit && (
        <p className="text-xs text-red-400 mb-4">{error.message}</p>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
