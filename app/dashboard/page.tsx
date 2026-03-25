import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";
import AthleteProfileCard from "@/components/athlete/AthleteProfileCard";
import AthleteStatsCard from "@/components/athlete/AthleteStatsCard";
import AthleteProfileSkeleton from "@/components/athlete/AthleteProfileSkeleton";
import RecentActivitiesList from "@/components/activities/RecentActivitiesList";
import ActivitiesSkeleton from "@/components/activities/ActivitiesSkeleton";

export default async function DashboardPage() {
  const session = await auth();
  const sessionData = session as Record<string, unknown> & typeof session;
  const accessToken = sessionData?.accessToken as string | undefined;
  const sessionError = sessionData?.error as string | undefined;

  if (!session || !accessToken || sessionError === "RefreshAccessTokenError") {
    redirect("/api/auth/signout");
  }

  const athleteId = Number(session?.user?.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Strava Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {session?.user?.name}
          </span>
          <LogoutButton />
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-4">
        <Suspense fallback={<AthleteProfileSkeleton />}>
          <AthleteProfileCard accessToken={accessToken} />
        </Suspense>
        <Suspense fallback={<AthleteProfileSkeleton />}>
          <AthleteStatsCard accessToken={accessToken} athleteId={athleteId} />
        </Suspense>
        <h2 className="text-lg font-semibold text-gray-900 mt-4">Recent Activities</h2>
        <Suspense fallback={<ActivitiesSkeleton />}>
          <RecentActivitiesList accessToken={accessToken} />
        </Suspense>
      </div>
    </main>
  );
}
