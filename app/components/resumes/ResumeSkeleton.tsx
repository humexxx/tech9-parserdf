export function ResumeCardSkeleton() {
  return (
    <div className="border border-[#e8e8e8] dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 rounded-lg">
      {/* Icon skeleton - matches ResumeCard icon */}
      <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-4 animate-pulse" />

      {/* Title skeleton - h3 with text-lg */}
      <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded mb-2 w-3/4 animate-pulse" />

      {/* Metadata skeletons - matches the two <p> elements */}
      <div className="flex flex-col gap-1 mt-2">
        <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-1/2 animate-pulse" />
        <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );
}

export function ResumesListSkeleton() {
  return (
    <div className="space-y-12 w-full">
      {/* Favorites Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Saved</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResumeCardSkeleton />
          <ResumeCardSkeleton />
          <ResumeCardSkeleton />
        </div>
      </section>

      {/* Recent Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent (Last 30 days)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResumeCardSkeleton />
          <ResumeCardSkeleton />
          <ResumeCardSkeleton />
        </div>
      </section>
    </div>
  );
}
