import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

import { ORGANIZATION_DETAIL_TEXT } from "./organization-labels";

/** Повторяет страницу организации: «Назад», шапка-карточка и две секции по три строки. */
export function OrganizationDetailSkeleton() {
  return (
    <div role="status" aria-label={ORGANIZATION_DETAIL_TEXT.loading} className="flex flex-col gap-4">
      <div className="flex h-10 items-center">
        <Skeleton className="h-5 w-20" />
      </div>
      <SkeletonCard>
        <div className="flex h-8 items-center">
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 shrink-0 rounded-xl" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton className="h-7 w-3/4 max-w-80" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
      </SkeletonCard>
      {[0, 1].map((section) => (
        <SkeletonCard key={section} className="gap-0 pb-2">
          <Skeleton className="h-6 w-48" />
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0"
            >
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          ))}
        </SkeletonCard>
      ))}
    </div>
  );
}
