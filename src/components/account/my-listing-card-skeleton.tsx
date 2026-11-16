import { Skeleton } from "@/components/ui/skeleton";

/** Повторяет `MyListingCard`: та же карточка, полоски вместо фото и текста. */
export function MyListingCardSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-2xl bg-card p-4 sm:flex-row">
      <Skeleton className="aspect-video w-full shrink-0 rounded-lg sm:aspect-auto sm:h-40 sm:w-60" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-2/5" />
        </div>
        <Skeleton className="h-7 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  );
}
