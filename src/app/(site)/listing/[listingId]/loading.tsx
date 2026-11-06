import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

/** Повторяет раскладку страницы объявления (см. page.tsx), чтобы контент не прыгал. */
export default function ListingLoading() {
  return (
    <main className="flex-1 bg-muted py-8" aria-busy="true">
      <Container className="flex flex-col gap-6">
        <Skeleton className="h-5 w-64" />
        <SkeletonCard className="gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-3/4 lg:h-9" />
          <Skeleton className="h-5 w-24" />
        </SkeletonCard>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-6">
            <div className="order-1 aspect-[4/3] overflow-hidden rounded-2xl bg-card">
              <Skeleton className="size-full rounded-none" />
            </div>
            <SkeletonCard className="order-3">
              <Skeleton className="h-7 w-40" />
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton key={index} className="h-20 rounded-xl" />
                ))}
              </div>
            </SkeletonCard>
          </div>

          <div className="order-2 flex flex-col gap-4">
            <SkeletonCard>
              <Skeleton className="h-9 w-1/2" />
            </SkeletonCard>
            <SkeletonCard>
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-12" />
            </SkeletonCard>
          </div>
        </div>
      </Container>
    </main>
  );
}
