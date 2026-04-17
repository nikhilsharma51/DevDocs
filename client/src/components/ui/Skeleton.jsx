// src/components/ui/Skeleton.jsx
export function Skeleton({ className }) {
  return (
    <div
      className={`bg-gray-100 rounded-lg animate-pulse ${className}`}
    />
  )
}

export function DocCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-3" />
      <div className="flex gap-1">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
    </div>
  )
}

export function DocListSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <DocCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function DocViewSkeleton() {
  return (
    <div className="max-w-2xl">
      <Skeleton className="h-3 w-24 mb-5" />
      <Skeleton className="h-7 w-2/3 mb-3" />
      <Skeleton className="h-3 w-48 mb-3" />
      <div className="flex gap-1 mb-6">
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-full mt-4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}