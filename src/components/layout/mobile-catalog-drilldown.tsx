"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { getCatalogMenuMessage } from "./catalog-menu-message";
import {
  catalogCategoryHref,
  catalogSubcategoryHref,
  type CatalogMenuCategory,
  type CatalogMenuRubric,
  type CatalogMenuTree,
} from "./catalog-menu-tree";
import { HEADER_NAV_LINKS, isHeaderNavActive } from "./header-nav-links";
import { PostListingButton } from "./post-listing-button";

const ROW =
  "flex min-h-10 w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-base transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
const SECTION_TITLE = "px-2 pt-2 text-xs font-medium text-muted-foreground";
/** Сдвиг столбца экранов: глубина 0, 1, 2. */
const TRACK_SHIFT = ["translate-x-0", "-translate-x-full", "-translate-x-[200%]"] as const;

/**
 * Содержимое бургера: один столбец экранов «вглубь» (drill-down).
 * Экран 0: рубрики (шеврон → экран рубрики), разделы сайта, «Подать объявление».
 * Экран 1: категории рубрики (с подкатегориями — шеврон → экран 2, без них — ссылка).
 * Экран 2: «Смотреть все» (страница категории) и подкатегории ссылками.
 * У рубрики своей страницы нет, поэтому на экране рубрики «Смотреть все» нет.
 * Стек — массив id выбранных узлов; компонент живёт внутри `SheetContent`, поэтому при закрытии
 * меню он размонтируется и стек сбрасывается. Скрытые экраны `inert`: в них нельзя попасть табом.
 */
export function MobileCatalogDrilldown({
  tree,
  pathname,
  onNavigate,
}: {
  tree: CatalogMenuTree | null;
  pathname: string;
  onNavigate: () => void;
}) {
  // Глубина и стек раздельно: при «Назад» уходящий экран доезжает с прежним содержимым.
  const [stack, setStack] = useState<string[]>([]);
  const [depth, setDepth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const focusTarget = useRef<string | null>(null);
  // Глубина, для которой фокус уже выставлен: эффект срабатывает только на реальную смену экрана
  // (и не на повторный запуск эффекта в StrictMode при открытии меню).
  const focusedDepth = useRef(depth);

  const rubric: CatalogMenuRubric | undefined = tree?.find((item) => item.id === stack[0]);
  const category: CatalogMenuCategory | undefined = rubric?.categories.find((item) => item.id === stack[1]);
  const message = getCatalogMenuMessage(tree);

  const open = (level: number, id: string) => {
    setStack((current) => [...current.slice(0, level), id]);
    setDepth(level + 1);
    focusTarget.current = null;
  };
  const back = () => {
    focusTarget.current = stack[depth - 1] ?? null;
    setDepth((current) => Math.max(0, current - 1));
  };

  // Фокус после перехода: вперёд — на «Назад» нового экрана, назад — на строку, из которой зашли.
  useEffect(() => {
    if (focusedDepth.current === depth) return;
    focusedDepth.current = depth;
    const panel = trackRef.current?.querySelector<HTMLElement>(`[data-level="${depth}"]`);
    if (!panel) return;
    const byId = focusTarget.current
      ? panel.querySelector<HTMLElement>(`[data-node-id="${focusTarget.current}"]`)
      : null;
    (byId ?? panel.querySelector<HTMLElement>("button, a"))?.focus();
  }, [depth]);

  const panelProps = (level: number) => ({
    "data-level": level,
    inert: depth !== level,
    className: "flex w-full shrink-0 flex-col overflow-y-auto px-2 py-2",
  });

  const backRow = (title: string) => (
    <>
      <button type="button" onClick={back} className={cn(ROW, "justify-start text-sm text-muted-foreground")}>
        <ChevronLeft aria-hidden className="size-4" />
        Назад
      </button>
      <h2 className="px-2 py-2 text-lg font-semibold">{title}</h2>
    </>
  );

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div ref={trackRef} className={cn("flex h-full transition-transform duration-300 ease-out", TRACK_SHIFT[depth])}>
        {/* Экран 0 */}
        <div {...panelProps(0)}>
          <h2 className={SECTION_TITLE}>Каталог</h2>
          {message !== null || tree === null ? (
            <p className="px-2 py-2 text-sm text-muted-foreground">{message}</p>
          ) : (
            <ul>
              {tree.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    data-node-id={item.id}
                    onClick={() => open(0, item.id)}
                    className={cn(ROW, "font-medium")}
                  >
                    {item.name}
                    <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <nav aria-label="Разделы" className="mt-2 border-t pt-2">
            <ul>
              {HEADER_NAV_LINKS.map((link) => {
                const active = isHeaderNavActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(ROW, "font-medium", active && "text-primary")}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto px-2 pt-4 pb-2">
            <PostListingButton variant="outline" alwaysShowLabel onClick={onNavigate} className="w-full" />
          </div>
        </div>

        {/* Экран 1: рубрика */}
        <div {...panelProps(1)}>
          {rubric && (
            <>
              {backRow(rubric.name)}
              <ul>
                {rubric.categories.map((item) => (
                  <li key={item.id}>
                    {item.subcategories.length > 0 ? (
                      <button
                        type="button"
                        data-node-id={item.id}
                        onClick={() => open(1, item.id)}
                        className={ROW}
                      >
                        {item.name}
                        <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
                      </button>
                    ) : (
                      <Link href={catalogCategoryHref(item.id)} onClick={onNavigate} className={ROW}>
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Экран 2: категория */}
        <div {...panelProps(2)}>
          {rubric && category && (
            <>
              {backRow(category.name)}
              <ul>
                <li>
                  <Link
                    href={catalogCategoryHref(category.id)}
                    onClick={onNavigate}
                    className={cn(ROW, "font-medium text-primary")}
                  >
                    Смотреть все
                  </Link>
                </li>
                {category.subcategories.map((item) => (
                  <li key={item.id}>
                    <Link href={catalogSubcategoryHref(category.id, item.id)} onClick={onNavigate} className={ROW}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
