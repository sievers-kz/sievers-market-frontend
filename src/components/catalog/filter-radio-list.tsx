"use client";

import { Search } from "lucide-react";
import { useId, useState } from "react";

import { Input } from "@/components/ui/input";

import type { FilterOption } from "./catalog-filter-fields";

/** Больше стольких вариантов — над списком поле поиска, список прокручивается. */
const SEARCH_THRESHOLD = 6;

interface FilterRadioListProps {
  /** Подпись группы для скринридера (видимый заголовок у карточки). */
  legend: string;
  /** Первый пункт без значения: «Любое», «Любой», «Все города». */
  anyLabel: string;
  options: readonly FilterOption[];
  /** Пустая строка — выбран первый пункт. */
  value: string;
  onChange: (value: string) => void;
}

function matches(label: string, query: string): boolean {
  return label.toLocaleLowerCase("ru-RU").includes(query.toLocaleLowerCase("ru-RU"));
}

/**
 * Выбор одного значения настоящими `input type="radio"` (бэкенд принимает одно значение на
 * атрибут). До 6 вариантов — просто список; больше — поле «Найти» и список с прокруткой.
 * Выбранный вариант виден всегда, даже если не подходит под поиск.
 */
export function FilterRadioList({ legend, anyLabel, options, value, onChange }: FilterRadioListProps) {
  const name = useId();
  const [query, setQuery] = useState("");
  const searchable = options.length > SEARCH_THRESHOLD;
  const trimmed = query.trim();

  const visible =
    searchable && trimmed
      ? options.filter((option) => option.value === value || matches(option.label, trimmed))
      : options;
  const nothingFound =
    searchable && trimmed !== "" && !options.some((option) => matches(option.label, trimmed));

  const items: FilterOption[] = [{ value: "", label: anyLabel }, ...visible];

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">{legend}</legend>
      {searchable && (
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Найти"
            aria-label={`Найти: ${legend}`}
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-10"
          />
        </div>
      )}
      <div className={searchable ? "-mx-2 max-h-60 overflow-y-auto px-2" : undefined}>
        {items.map((option) => (
          <label
            key={option.value || "__any__"}
            className="flex min-h-10 items-center gap-2 rounded-md py-2 text-sm has-focus-visible:outline-2 has-focus-visible:outline-ring"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="size-4 shrink-0 accent-primary"
            />
            {option.swatch && (
              <span
                aria-hidden
                className="size-4 shrink-0 rounded-sm border border-foreground/20"
                style={{ backgroundColor: option.swatch }}
              />
            )}
            <span className="min-w-0">{option.label}</span>
          </label>
        ))}
        {nothingFound && <p className="py-2 text-sm text-muted-foreground">Ничего не найдено</p>}
      </div>
    </fieldset>
  );
}
