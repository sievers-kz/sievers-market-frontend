import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

/** Повторяет раскладку карточек организаций. */
export function OrganizationsListSkeleton() {
  return (
    <div role="status" aria-label="Загружаем организации" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {[0, 1].map((index) => (
        <SkeletonCard key={index}>
          <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
            <div className="flex w-full flex-col gap-1">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <Skeleton className="h-8 w-32 shrink-0 rounded-full" />
          </div>
          <Skeleton className="h-5 w-full" />
        </SkeletonCard>
      ))}
    </div>
  );
}
