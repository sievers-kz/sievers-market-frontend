import { Skeleton } from "@/components/ui/skeleton";

/** Повторяет `OrganizationCard`: квадрат логотипа и две строки. */
export function OrganizationCardSkeleton() {
  return (
    <div className="flex w-full min-w-0 flex-col rounded-2xl bg-card p-4 lg:p-6">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="mt-4 h-6 w-3/4" />
      <Skeleton className="mt-2 h-5 w-1/2" />
    </div>
  );
}
