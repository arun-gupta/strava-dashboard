"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signIn("strava");
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-[#FC4C02] hover:bg-[#e04402] disabled:opacity-70 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
    >
      {loading ? (
        <>
          <svg
            role="status"
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Connecting"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Connecting…
        </>
      ) : (
        "Connect with Strava"
      )}
    </button>
  );
}
