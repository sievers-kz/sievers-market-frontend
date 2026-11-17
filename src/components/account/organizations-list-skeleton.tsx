import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

/** Повторяет раскладку карточек организаций: две колонки от `sm`, тег сверху, квадрат и две строки. */
export function OrganizationsListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Загружаем организации"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {[0, 1].map((index) => (
        <SkeletonCard key={index}>
          <div className="flex h-8 items-center">
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}
