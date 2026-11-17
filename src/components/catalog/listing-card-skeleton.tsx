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
      <div className={cn("shrink-0 p-2", isList && "sm:flex sm:w-64 sm:self-stretch")}>
        <Skeleton
          className={cn(
            "aspect-video rounded-lg",
            isList && "sm:aspect-auto sm:min-h-36 sm:flex-1",
          )}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 px-4 pt-2 pb-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-7 w-2/5" />
        <Skeleton className="h-5 w-1/2" />
        <div className="mt-auto pt-2">
          <div className="border-t border-border pt-2">
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
