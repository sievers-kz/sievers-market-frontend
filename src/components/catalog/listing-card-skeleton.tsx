import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2 h-6 w-2/5" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
