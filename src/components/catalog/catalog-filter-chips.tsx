import { XIcon } from "lucide-react";
import Link from "next/link";

import type { FilterChip } from "./catalog-filter-fields";
import { buildCatalogHref, resetCatalogFilters, type CatalogParams, type CatalogScope } from "./search-params";

interface CatalogFilterChipsProps {
  scope: CatalogScope;
  params: CatalogParams;
  chips: readonly FilterChip[];
}

/** Выбранные фильтры над списком: крестик убирает один фильтр, «Сбросить фильтры» все. */
export function CatalogFilterChips({ scope, params, chips }: CatalogFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul aria-label="Выбранные фильтры" className="contents">
        {chips.map((chip) => (
          <li key={chip.id} className="flex min-w-0">
            <Link
              href={buildCatalogHref(scope, chip.params)}
              aria-label={`Убрать фильтр «${chip.label}»`}
              className="flex h-10 min-w-0 items-center gap-2 rounded-full bg-card py-2 pr-2 pl-4 text-sm transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="truncate">{chip.label}</span>
              <XIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={buildCatalogHref(scope, resetCatalogFilters(params))}
        className="flex h-10 items-center rounded-sm px-2 text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        Сбросить фильтры
      </Link>
    </div>
  );
}
