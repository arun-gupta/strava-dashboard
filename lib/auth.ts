import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "@auth/core/jwt";
import Strava from "next-auth/providers/strava";

interface Token extends JWT {
  athleteId?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
}

async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID!,
        client_secret: process.env.STRAVA_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshed = await response.json();

    if (!response.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      accessTokenExpires: refreshed.expires_at * 1000,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const config: NextAuthConfig = {
  trustHost: true,
  providers: [
    Strava({
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read,activity:read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        return {
          ...token,
          athleteId: profile.id,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: (account.expires_at ?? 0) * 1000,
        };
      }

      // Return token if not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Refresh expired token
      return refreshAccessToken(token as Token);
    },
    async session({ session, token }) {
      const t = token as Token;
      session.user.id = t.athleteId ?? "";
      (session as Record<string, unknown> & typeof session).accessToken = t.accessToken;
      (session as Record<string, unknown> & typeof session).error = t.error;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
