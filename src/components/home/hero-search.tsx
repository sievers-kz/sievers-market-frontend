import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Поле поиска в hero. Неактивно (`disabled`) по спецификации главной: поиск из hero включим
 * отдельной задачей. Размеры: десктоп высота 64, кнопка 48; телефон 56 и 40.
 */
export function HeroSearch({ size, className }: { size: "desktop" | "mobile"; className?: string }) {
  const desktop = size === "desktop";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl bg-background shadow-[0_8px_24px_rgb(27_43_38/0.08)]",
        desktop ? "h-16 pr-2 pl-6" : "h-14 pr-2 pl-4",
        className,
      )}
    >
      <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      <input
        type="search"
        disabled
        aria-label="Поиск по объявлениям"
        placeholder="Трактор, комбайн, сеялка…"
        className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
      <button
        type="button"
        disabled
        className={cn(
          "shrink-0 rounded-lg bg-primary font-semibold text-primary-foreground disabled:opacity-60",
          desktop ? "h-12 px-6" : "h-10 px-4 text-sm",
        )}
      >
        Найти
      </button>
    </div>
  );
}
