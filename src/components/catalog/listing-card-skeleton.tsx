import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { cn } from "@/lib/utils";

import type { CatalogView } from "./search-params";

/** Повторяет `ListingCard`: та же карточка-объект, полоски вместо картинки и текста. */
export function ListingCardSkeleton({ view = "grid" }: { view?: CatalogView }) {
  const isList = view === "list";

  return (
    <SkeletonCard
      variant="card"
      className={cn(
        "w-full min-w-0 gap-0 overflow-hidden p-0",
        isList && "sm:flex-row",
      )}
    >
      <div className={cn("shrink-0 p-2", isList && "sm:flex sm:w-64 sm:self-stretch")}>
        <Skeleton
          className={cn(
            "aspect-video rounded-lg",
            isList && "sm:aspect-auto sm:min-h-36 sm:flex-1",
          )}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-7 w-2/5" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </SkeletonCard>
  );
}
