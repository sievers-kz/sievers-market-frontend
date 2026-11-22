import { Search } from "lucide-react";

import { SEARCH_TEXT_MAX_LENGTH } from "@/components/catalog/search-params";
import { cn } from "@/lib/utils";

/**
 * Поле поиска в hero: обычная форма GET на `/search?q=<текст>`, без клиентского кода.
 * Пустой запрос и запрос из одних пробелов не отправляются (`required` + `pattern`);
 * пробелы по краям обрезает разбор `q` на `/search` (`parseSearchText`), как у поиска в шапке.
 * Размеры: десктоп высота 64, кнопка 48; телефон 56 и 40.
 */
export function HeroSearch({ size, className }: { size: "desktop" | "mobile"; className?: string }) {
  const desktop = size === "desktop";

  return (
    <form
      role="search"
      method="get"
      action="/search"
      className={cn(
        "flex items-center gap-2 rounded-2xl bg-background shadow-[0_8px_24px_rgb(27_43_38/0.08)] focus-within:ring-2 focus-within:ring-primary/30",
        desktop ? "h-16 pr-2 pl-6" : "h-14 pr-2 pl-4",
        className,
      )}
    >
      <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      <input
        type="search"
        name="q"
        required
        pattern=".*\S.*"
        maxLength={SEARCH_TEXT_MAX_LENGTH}
        enterKeyHint="search"
        autoComplete="off"
        aria-label="Поиск по объявлениям"
        placeholder="Трактор, комбайн, сеялка…"
        className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-lg bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
          desktop ? "h-12 px-6" : "h-10 px-4 text-sm",
        )}
      >
        Найти
      </button>
    </form>
  );
}
