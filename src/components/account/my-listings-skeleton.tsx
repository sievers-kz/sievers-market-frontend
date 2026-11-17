import { Skeleton } from "@/components/ui/skeleton";

import { MyListingCardSkeleton } from "./my-listing-card-skeleton";
import { MY_LISTINGS_TEXT } from "./my-listings-labels";

/**
 * Заглушка всей страницы (`loading.tsx` и `Suspense` вокруг `useSearchParams`): заголовок,
 * панель фильтров той же высоты и три карточки.
 */
export function MyListingsSkeleton() {
  return (
    <div role="status" aria-label={MY_LISTINGS_TEXT.loading} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-64 lg:h-9" />
        <Skeleton className="h-12 w-full sm:w-56" />
      </div>
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 sm:p-6">
        <div className="flex gap-2 sm:grid sm:grid-cols-4 sm:gap-4">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-10 w-24 shrink-0 rounded-lg sm:h-12 sm:w-auto" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-10" />
          ))}
        </div>
      </div>
      {[0, 1, 2].map((index) => (
        <MyListingCardSkeleton key={index} />
      ))}
    </div>
  );
}
