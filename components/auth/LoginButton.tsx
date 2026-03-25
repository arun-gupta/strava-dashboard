"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("strava")}
      className="bg-[#FC4C02] hover:bg-[#e04402] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
    >
      Connect with Strava
    </button>
  );
}
