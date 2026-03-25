export default function AthleteProfileSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200">
      <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-5 bg-gray-200 rounded w-40" />
        <div className="h-4 bg-gray-200 rounded w-28" />
      </div>
    </div>
  );
}
