import { Skeleton } from '@/components/ui/skeleton';

export function UserExpandedRowSkeleton() {
  return (
    <tr className="bg-gray-50 border-t-2 border-primary/20 animate-in fade-in duration-300">
      <td colSpan={5} className="p-6">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>

          {/* Quick Stats Row skeleton */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          {/* Chart skeleton */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </td>
    </tr>
  );
}
