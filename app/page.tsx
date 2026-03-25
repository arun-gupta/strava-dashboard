import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/auth/LoginButton";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  const sessionError = (session as Record<string, unknown> & typeof session)?.error as string | undefined;
  if (session && !sessionError) redirect("/dashboard");

  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-4xl font-bold text-gray-900">Strava Dashboard</h1>
        <p className="text-lg text-gray-600">
          Visualize your running data. Connect your Strava account to get started.
        </p>
        {error && <ErrorMessage error={error} />}
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
