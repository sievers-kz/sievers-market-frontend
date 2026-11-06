import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10" />
    </div>
  );
}

/** Скелетон страницы: выбор каталога, место под форму и подсказки. */
export function ListingCreateSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <SkeletonCard className="grid md:grid-cols-3">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
      </SkeletonCard>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <SkeletonCard className="items-center">
          <Skeleton className="h-6 w-full max-w-96" />
        </SkeletonCard>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }, (_, index) => (
            <SkeletonCard key={index} className="flex-row">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  );
}
