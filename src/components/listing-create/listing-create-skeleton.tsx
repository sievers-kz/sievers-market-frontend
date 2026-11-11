import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { ListingCardSkeleton } from "@/components/catalog/listing-card-skeleton";

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10" />
    </div>
  );
}

/** Скелетон страницы: слева организация, выбор каталога и место под форму, справа превью. */
export function ListingCreateSkeleton() {
  return (
    <div
      className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
      aria-busy="true"
    >
      <div className="flex min-w-0 flex-col gap-6">
        <SkeletonCard>
          <FieldSkeleton />
        </SkeletonCard>
        <SkeletonCard className="grid md:grid-cols-3">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </SkeletonCard>
        <SkeletonCard className="items-center">
          <Skeleton className="h-6 w-full max-w-96" />
        </SkeletonCard>
      </div>
      <div className="hidden flex-col gap-2 lg:flex">
        <Skeleton className="h-5 w-48" />
        <ListingCardSkeleton />
      </div>
    </div>
  );
}
