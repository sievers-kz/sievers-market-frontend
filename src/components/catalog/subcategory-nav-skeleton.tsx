import { Skeleton } from "@/components/ui/skeleton";

/** Повторяет `SubcategoryNav`: строка на телефоне, список в сайдбаре с `lg`. */
export function SubcategoryNavSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="mb-2 hidden h-7 w-32 lg:mx-2 lg:block" />
      <div className="flex gap-2 overflow-hidden lg:flex-col lg:gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 shrink-0 rounded-lg lg:w-auto" />
        ))}
      </div>
    </div>
  );
}
