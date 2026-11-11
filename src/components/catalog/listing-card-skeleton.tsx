import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { CatalogView } from "./search-params";

/** Повторяет `ListingCard`: та же карточка, полоски вместо картинки и текста. */
export function ListingCardSkeleton({ view = "grid" }: { view?: CatalogView }) {
  const isList = view === "list";

  return (
    <div
      className={cn(
        "flex w-full min-w-0 overflow-hidden rounded-2xl bg-card",
        isList ? "flex-col sm:flex-row" : "flex-col",
      )}
    >
      <Skeleton
        className={cn(
          "aspect-video shrink-0 rounded-none",
          isList && "sm:aspect-auto sm:min-h-40 sm:w-64 sm:self-stretch",
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-7 w-2/5" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}
