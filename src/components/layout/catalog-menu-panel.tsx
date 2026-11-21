"use client";

import Link from "next/link";
import { NavigationMenu } from "radix-ui";
import { useEffect, useId, useRef, useState } from "react";

import { buildCatalogHref, categoryScope } from "@/components/catalog/search-params";
import type { CategoryTree } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

import { Container } from "./container";

/** Сколько подкатегорий показывать под категорией; остальные за ссылкой «Смотреть все». */
const SUBCATEGORY_LIMIT = 6;
/** Задержка переключения рубрики при наведении, чтобы вкладки не мигали при проходе курсора. */
const TAB_HOVER_DELAY_MS = 150;

const LINK_FOCUS = "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/**
 * Содержимое панели «Каталога» (с `lg`): сверху вкладки рубрик, под ними категории выбранной рубрики
 * колонками (3 на `md`, 4 на `lg`) с подкатегориями. Три уровня: рубрика → категория → подкатегория.
 * Ссылки — `NavigationMenu.Link`, поэтому выбор ссылки закрывает меню.
 */
export function CatalogMenuPanel({ rubrics }: { rubrics: CategoryTree }) {
  const [activeId, setActiveId] = useState(rubrics[0]?.id);
  const hoverTimer = useRef<number | undefined>(undefined);
  const baseId = useId();
  const active = rubrics.find((rubric) => rubric.id === activeId) ?? rubrics[0];

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  if (!active) return null;

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = `${baseId}-panel`;

  return (
    <Container className="flex flex-col gap-6 py-6">
      <div role="tablist" aria-label="Рубрики" className="flex gap-6 overflow-x-auto border-b">
        {rubrics.map((rubric) => {
          const isActive = rubric.id === active.id;
          return (
            <button
              key={rubric.id}
              id={tabId(rubric.id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              onClick={() => setActiveId(rubric.id)}
              onFocus={() => setActiveId(rubric.id)}
              onMouseEnter={() => {
                window.clearTimeout(hoverTimer.current);
                hoverTimer.current = window.setTimeout(() => setActiveId(rubric.id), TAB_HOVER_DELAY_MS);
              }}
              onMouseLeave={() => window.clearTimeout(hoverTimer.current)}
              className={cn(
                "-mb-px border-b-2 pb-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {rubric.name}
            </button>
          );
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(active.id)}
        className="grid grid-cols-3 gap-x-8 gap-y-8 lg:grid-cols-4"
      >
        {active.categories.map((category) => {
          const categoryHref = buildCatalogHref(categoryScope(category.id), { page: 1, view: "grid" });
          const shown = category.subcategories.slice(0, SUBCATEGORY_LIMIT);
          const hasMore = category.subcategories.length > SUBCATEGORY_LIMIT;
          return (
            <div key={category.id} className="flex min-w-0 flex-col gap-2">
              <NavigationMenu.Link asChild>
                <Link
                  href={categoryHref}
                  className={cn("self-start font-semibold transition-colors hover:text-primary", LINK_FOCUS)}
                >
                  {category.name}
                </Link>
              </NavigationMenu.Link>
              {shown.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {shown.map((subcategory) => (
                    <li key={subcategory.id}>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={buildCatalogHref(categoryScope(category.id), {
                            subcategoryId: subcategory.id,
                            page: 1,
                            view: "grid",
                          })}
                          className={cn(
                            "text-sm text-muted-foreground transition-colors hover:text-primary",
                            LINK_FOCUS,
                          )}
                        >
                          {subcategory.name}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                  {hasMore && (
                    <li>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={categoryHref}
                          className={cn("text-sm font-medium text-primary hover:underline", LINK_FOCUS)}
                        >
                          Смотреть все
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
