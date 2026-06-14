// SkeletonLoader.tsx — Generic skeleton component for loading states
"use client";

interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
  return (
    <div
      className={`skeleton-pulse rounded-sm ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`border border-[#b9b29c]/15 bg-surface p-6 space-y-3 ${className}`}>
      <SkeletonBlock className="h-3 w-32" />
      <SkeletonBlock className="h-5 w-48" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock key={i} className={`h-3 ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-[#b9b29c]/10">
      <td className="px-6 py-4"><SkeletonBlock className="h-3 w-20" /></td>
      <td className="px-6 py-4"><SkeletonBlock className="h-3 w-28" /></td>
      <td className="px-6 py-4"><SkeletonBlock className="h-3 w-24" /></td>
      <td className="px-6 py-4"><SkeletonBlock className="h-3 w-48" /></td>
      <td className="px-6 py-4 flex justify-end"><SkeletonBlock className="h-5 w-16" /></td>
    </tr>
  );
}

export function SkeletonMetricDial() {
  return (
    <div className="flex flex-col items-center gap-2">
      <SkeletonBlock className="w-24 h-24 rounded-full" />
      <SkeletonBlock className="h-2 w-20" />
    </div>
  );
}

export function SkeletonForensicPage() {
  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header skeleton */}
      <div className="border-b border-[#b9b29c]/20 pb-6 flex justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-2 w-40" />
          <SkeletonBlock className="h-10 w-80" />
          <SkeletonBlock className="h-2 w-56" />
        </div>
        <div className="space-y-2 text-right">
          <SkeletonBlock className="h-2 w-40" />
          <SkeletonBlock className="h-2 w-32" />
        </div>
      </div>

      {/* Metadata card skeleton */}
      <div className="border border-[#b9b29c]/15 bg-surface p-6 space-y-4">
        <SkeletonBlock className="h-2 w-36" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-2 w-24" />
            <SkeletonBlock className="h-16 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-2 w-24" />
            <SkeletonBlock className="h-16 w-full" />
          </div>
        </div>
      </div>

      {/* Processing stats skeleton */}
      <div className="border border-[#b9b29c]/15 bg-surface p-5">
        <SkeletonBlock className="h-2 w-40 mb-4" />
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-[#fff9ee] border border-[#b9b29c]/10 p-3">
              <SkeletonBlock className="w-4 h-4 rounded" />
              <SkeletonBlock className="h-6 w-12" />
              <SkeletonBlock className="h-2 w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* Verdict skeleton */}
      <div className="border border-[#b9b29c]/15 p-8 bg-surface space-y-6">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <SkeletonBlock className="h-2 w-32" />
              <SkeletonBlock className="h-8 w-24" />
            </div>
          </div>
          <SkeletonBlock className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-3 gap-6 py-4 border-y border-[#b9b29c]/10">
          <SkeletonMetricDial />
          <SkeletonMetricDial />
          <SkeletonMetricDial />
        </div>
        <SkeletonBlock className="h-16 w-full" />
      </div>

      {/* Collapsed section skeletons */}
      {[...Array(7)].map((_, i) => (
        <div key={i} className="border border-[#b9b29c]/15 bg-surface p-5 flex justify-between items-center">
          <SkeletonBlock className="h-3 w-48" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonIntelligencePage() {
  return (
    <div className="w-full space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <SkeletonBlock className="h-2 w-40" />
        <SkeletonBlock className="h-10 w-64" />
        <SkeletonBlock className="h-3 w-96" />
      </div>
      <div className="border border-[#b9b29c]/15 p-8 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <SkeletonBlock className="h-2 w-28" />
          <SkeletonBlock className="w-28 h-28 rounded-full" />
          <SkeletonBlock className="h-2 w-20" />
        </div>
        <div className="flex-1 w-full space-y-4">
          <SkeletonBlock className="h-3 w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-surface border border-[#b9b29c]/15 p-3 flex justify-between">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} lines={4} />
        ))}
      </div>
    </div>
  );
}
