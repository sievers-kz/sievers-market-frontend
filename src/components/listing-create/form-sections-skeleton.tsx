import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

/** Заглушка аккордеонов, пока грузится форма подкатегории: заголовок секции и поля. */
export function FormSectionsSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Загрузка формы">
      <SkeletonCard className="gap-6 pt-0">
        <div className="flex h-16 items-center">
          <Skeleton className="h-6 w-56" />
        </div>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10" />
          </div>
        ))}
      </SkeletonCard>
      {Array.from({ length: 3 }, (_, index) => (
        <SkeletonCard key={index} className="h-16 justify-center py-0">
          <Skeleton className="h-6 w-40" />
        </SkeletonCard>
      ))}
    </div>
  );
}
