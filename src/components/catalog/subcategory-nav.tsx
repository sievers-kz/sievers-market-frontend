import Link from "next/link";

import type { components } from "@/lib/api/schema";
import { cn } from "@/lib/utils";

import { buildCatalogHref, type CatalogParams } from "./search-params";

type SubcategoryResponse = components["schemas"]["SubcategoryResponse"];

interface SubcategoryNavProps {
  categoryId: string;
  subcategories: SubcategoryResponse[];
  params: CatalogParams;
}

/**
 * Выбор одной подкатегории. Каждый пункт — ссылка: страница сбрасывается на 1, вид сохраняется.
 * На мобильных — горизонтальная строка, с `lg` — вертикальный список в сайдбаре.
 * Сайдбар плоский: без фона, рамки и тени, выделен только активный пункт. В строке на телефоне
 * неактивные пункты на `bg-muted`, чтобы читались как кнопки (как вкладки кабинета).
 */
export function SubcategoryNav({
  categoryId,
  subcategories,
  params,
}: SubcategoryNavProps) {
  const items = [
    { id: undefined, name: "Все" },
    ...subcategories.map((s) => ({ id: s.id, name: s.name })),
  ];

  return (
    <nav aria-label="Категории">
      <h2 className="sr-only lg:not-sr-only lg:mb-2 lg:px-2 lg:text-lg lg:font-semibold">
        Категории
      </h2>
      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
        {items.map((item) => {
          const isActive = item.id === params.subcategoryId;
          return (
            <li key={item.id ?? "all"} className="shrink-0">
              <Link
                href={buildCatalogHref(categoryId, {
                  subcategoryId: item.id,
                  page: 1,
                  view: params.view,
                })}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-4 py-2 text-sm whitespace-nowrap transition-colors lg:whitespace-normal",
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "bg-muted lg:bg-transparent lg:hover:bg-muted",
                )}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
