import { Skeleton } from "@/components/ui/skeleton";

/** Повторяет `CatalogFilterPanel` (с `lg`) и кнопку «Фильтры» (ниже `lg`). */
export function CatalogFilterPanelSkeleton() {
  return (
    <div aria-hidden className="hidden flex-col gap-6 rounded-2xl bg-card p-6 lg:flex">
      <Skeleton className="h-7 w-32" />
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
