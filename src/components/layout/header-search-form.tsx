"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  buildCatalogHref,
  parseSearchText,
  SEARCH_TEXT_MAX_LENGTH,
} from "@/components/catalog/search-params";

interface HeaderSearchFormProps {
  /** Текст в поле при показе: на `/search` это текущий `q`, иначе пусто. */
  initialText: string;
}

/**
 * Поле поиска в шапке. Enter или кнопка с лупой ведут на `/search?q=<текст>` (пробелы по краям
 * обрезаются, как при разборе `q`); пустой запрос или из одних пробелов не отправляется.
 */
export function HeaderSearchForm({ initialText }: HeaderSearchFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialText);

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
    <form role="search" onSubmit={handleSubmit} className="relative min-w-0 flex-1">
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
        placeholder="Поиск по объявлениям"
        className="h-12 w-full rounded-md border border-transparent bg-muted pr-14 pl-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label="Найти"
        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <Search aria-hidden />
      </Button>
    </form>
  );
}
