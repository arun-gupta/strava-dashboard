import { auth } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const session = await auth();

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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-gray-500">Your running data will appear here.</p>
      </div>
    </main>
  );
}
