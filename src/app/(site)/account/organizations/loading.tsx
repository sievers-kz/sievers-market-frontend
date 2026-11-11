import { OrganizationsListSkeleton } from "@/components/account/organizations-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Рендерится в колонке контента каркаса: сайдбар остаётся на месте. */
export default function OrganizationsLoading() {
  return (
    <>
      <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-64 lg:h-9" />
        <Skeleton className="h-12 w-full sm:w-64" />
      </div>
      <OrganizationsListSkeleton />
    </>
  );
}
