"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-gray-500 mb-4">
        Unable to load your Strava data. Please try again.
      </p>
      {process.env.NODE_ENV === "development" && (
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
