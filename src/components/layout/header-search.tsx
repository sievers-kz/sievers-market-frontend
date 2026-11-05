import { Search } from "lucide-react";

/** Поле поиска без функции: поиск по объявлениям будет отдельной задачей (backend#205, #206). */
export function HeaderSearch() {
  return (
    <div className="relative min-w-0 flex-1">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        disabled
        aria-label="Поиск по объявлениям"
        placeholder="Поиск по объявлениям"
        className="h-12 w-full rounded-md bg-muted pr-4 pl-10 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  );
}
