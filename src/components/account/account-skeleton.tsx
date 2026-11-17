import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

import { ACCOUNT_TEXT } from "./account-labels";

/** Повторяет страницу «Аккаунт»: заголовок и две карточки (одна и две строки). */
export function AccountSkeleton() {
  return (
    <div role="status" aria-label={ACCOUNT_TEXT.loading} className="flex flex-col gap-4">
      <div className="flex py-2">
        <Skeleton className="h-8 w-64 lg:h-9" />
      </div>
      {[1, 2].map((rows) => (
        <SkeletonCard key={rows} className="gap-0 pb-2">
          <Skeleton className="h-6 w-48" />
          {Array.from({ length: rows }, (_, row) => (
            <div
              key={row}
              className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-2/3" />
              </div>
              <Skeleton className="h-10 w-24 shrink-0" />
            </div>
          ))}
        </SkeletonCard>
      ))}
    </div>
  );
}
