import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { buildCatalogHref, type CatalogParams } from "./search-params";

interface CatalogPaginationProps {
  categoryId: string;
  params: CatalogParams;
  pages: number;
}

/** Номера страниц: первая, последняя и соседи текущей; пропуски — многоточием. */
function pageItems(current: number, pages: number): Array<number | "gap"> {
  const result: Array<number | "gap"> = [];
  for (let page = 1; page <= pages; page++) {
    if (page === 1 || page === pages || Math.abs(page - current) <= 1) {
      result.push(page);
    } else if (result.at(-1) !== "gap") {
      result.push("gap");
    }
  }
  return result;
}

const itemClass =
  "flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm transition-colors";

function PageLink({
  href,
  label,
  isActive,
  children,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        itemClass,
        isActive ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
      )}
    >
      {children}
    </Link>
  );
}

export function CatalogPagination({
  categoryId,
  params,
  pages,
}: CatalogPaginationProps) {
  if (pages <= 1) return null;

  const current = params.page;
  const hrefFor = (page: number) =>
    buildCatalogHref(categoryId, { ...params, page });

  return (
    <nav aria-label="Страницы" className="flex justify-center">
      <ul className="flex flex-wrap items-center gap-2">
        {current > 1 && (
          <li>
            <PageLink href={hrefFor(current - 1)} label="Предыдущая страница">
              <ChevronLeft className="size-4" aria-hidden />
            </PageLink>
          </li>
        )}
        {pageItems(current, pages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className={cn(itemClass, "text-muted-foreground")}>
              …
            </li>
          ) : (
            <li key={item}>
              <PageLink
                href={hrefFor(item)}
                label={`Страница ${item}`}
                isActive={item === current}
              >
                {item}
              </PageLink>
            </li>
          ),
        )}
        {current < pages && (
          <li>
            <PageLink href={hrefFor(current + 1)} label="Следующая страница">
              <ChevronRight className="size-4" aria-hidden />
            </PageLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
