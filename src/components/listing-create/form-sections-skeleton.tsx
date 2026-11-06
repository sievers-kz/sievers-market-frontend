import { Skeleton } from "@/components/ui/skeleton";

/** Заглушка аккордеонов, пока грузится форма подкатегории. */
export function FormSectionsSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Загрузка формы">
      <Skeleton className="h-64 rounded-2xl bg-card" />
      <Skeleton className="h-48 rounded-2xl bg-card" />
      <Skeleton className="h-16 rounded-2xl bg-card" />
      <Skeleton className="h-16 rounded-2xl bg-card" />
    </div>
  );
}
