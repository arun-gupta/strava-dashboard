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
      className="bg-[#FC4C02] hover:bg-[#e04402] disabled:opacity-70 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
    >
      {loading ? "Connecting…" : "Connect with Strava"}
    </button>
  );
}
