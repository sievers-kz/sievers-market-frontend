"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { buildCatalogHref } from "@/components/catalog/search-params";
import type { CategoryTree } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

const LINK_FOCUS = "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/**
 * Содержимое десктопной панели каталога: слева рубрики (переключают правую часть),
 * справа категории выбранной рубрики колонками со ссылками на подкатегории.
 */
export function CatalogMenuPanel({
  rubrics,
  onNavigate,
}: {
  rubrics: CategoryTree;
  onNavigate: () => void;
}) {
  const [activeId, setActiveId] = useState(rubrics[0]?.id);
  const active = rubrics.find((rubric) => rubric.id === activeId) ?? rubrics[0];
  const contentId = useId();

  if (!active) return null;

  return (
    <div className="flex min-h-0 flex-1">
      <ul aria-label="Рубрики" className="flex w-76 shrink-0 flex-col gap-1 overflow-y-auto border-r p-2">
        {rubrics.map((rubric) => {
          const isActive = rubric.id === active.id;
          const select = () => setActiveId(rubric.id);
          return (
            <li key={rubric.id}>
              <button
                type="button"
                aria-controls={contentId}
                aria-current={isActive ? "true" : undefined}
                onClick={select}
                onFocus={select}
                onMouseEnter={select}
                className={cn(
                  "w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                )}
              >
                {rubric.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div
        id={contentId}
        role="region"
        aria-label={active.name}
        className="grid min-w-0 flex-1 grid-cols-3 content-start gap-6 overflow-y-auto p-6"
      >
        {active.categories.map((category) => (
          <div key={category.id} className="flex min-w-0 flex-col gap-2">
            <Link
              href={buildCatalogHref(category.id, { page: 1, view: "grid" })}
              onClick={onNavigate}
              className={cn("self-start font-semibold transition-colors hover:text-primary", LINK_FOCUS)}
            >
              {category.name}
            </Link>
            {category.subcategories.length > 0 && (
              <ul className="flex flex-col gap-2">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <Link
                      href={buildCatalogHref(category.id, {
                        subcategoryId: subcategory.id,
                        page: 1,
                        view: "grid",
                      })}
                      onClick={onNavigate}
                      className={cn(
                        "text-sm text-muted-foreground transition-colors hover:text-primary",
                        LINK_FOCUS,
                      )}
                    >
                      {subcategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
