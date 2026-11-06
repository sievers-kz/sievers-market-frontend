import { Skeleton } from "@/components/ui/skeleton";

/** Скелетон страницы: выбор каталога, форма и подсказки. */
export function ListingCreateSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <Skeleton className="h-32 rounded-2xl bg-card md:h-24" />
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <Skeleton className="h-16 rounded-2xl bg-card" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 rounded-2xl bg-card" />
          <Skeleton className="h-40 rounded-2xl bg-card" />
        </div>
      </div>
    </div>
  );
}
