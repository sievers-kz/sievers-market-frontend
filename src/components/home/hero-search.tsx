"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import {
  buildCatalogHref,
  parseSearchText,
  SEARCH_TEXT_MAX_LENGTH,
} from "@/components/catalog/search-params";
import { cn } from "@/lib/utils";

/**
 * Поле поиска в hero. Как поиск в шапке (`HeaderSearchForm`): Enter или «Найти» ведут на
 * `/search?q=<текст>`, пробелы по краям обрезаются, пустой запрос не отправляется.
 * Без JavaScript форма уходит обычным GET на `/search` (там `q` разбирается так же).
 * Размеры: десктоп высота 64, кнопка 48; телефон 56 и 40.
 */
export function HeroSearch({ size, className }: { size: "desktop" | "mobile"; className?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const desktop = size === "desktop";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = parseSearchText(value);
    if (!text) {
      setValue("");
      inputRef.current?.focus();
      return;
    }
    router.push(buildCatalogHref({ kind: "search", text }, { page: 1, view: "grid" }));
  }

  return (
    <form
      role="search"
      action="/search"
      method="get"
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2 rounded-2xl bg-background shadow-[0_8px_24px_rgb(27_43_38/0.08)] focus-within:ring-2 focus-within:ring-primary/30",
        desktop ? "h-16 pr-2 pl-6" : "h-14 pr-2 pl-4",
        className,
      )}
    >
      <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
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
