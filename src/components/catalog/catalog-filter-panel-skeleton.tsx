import { Skeleton } from "@/components/ui/skeleton";

/** Повторяет `CatalogFilterPanel` (с `lg`): карточки цены и города, блок кнопок. */
export function CatalogFilterPanelSkeleton() {
  return (
    <div aria-hidden className="hidden flex-col gap-4 lg:flex">
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="flex flex-col gap-4 rounded-2xl bg-card px-6 py-4">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <div className="flex flex-col gap-2 rounded-b-2xl border-t bg-card px-6 py-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
