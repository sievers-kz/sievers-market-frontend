"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import { useCallback, useRef, useState } from "react";

import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";
import { cn } from "@/lib/utils";

import { getCatalogMenuMessage } from "./catalog-menu-message";
import { CatalogMenuPanel } from "./catalog-menu-panel";
import type { CatalogMenuTree } from "./catalog-menu-tree";
import { Container } from "./container";
import { HEADER_NAV_ITEM_CLASS } from "./header-nav-item";
import { HEADER_NAV_LINKS, isHeaderNavActive } from "./header-nav-links";

const CATALOG_VALUE = "catalog";
/** Сколько после наведения на «Каталог» клик мышью не закрывает открывшуюся панель. */
const HOVER_CLICK_GRACE_MS = 1000;

/**
 * Разделы в центре шапки (с `lg`): «Каталог» с мега-меню (docs/pages/mega-menu.md), «Организации», «О нас»,
 * «Поддержка». Радикс NavigationMenu: панель открывается наведением, кликом и с клавиатуры, закрывается
 * при уходе курсора, по Esc, при выборе ссылки и смене маршрута. Активный раздел — `primary`.
 * Панель позиционируется от `header` (он `relative`): на всю ширину под шапкой, содержимое в `Container`.
 */
export function HeaderNav({ tree, className }: { tree: CatalogMenuTree | null; className?: string }) {
  const pathname = usePathname();
  const [value, setValue] = useState("");
  const lastPointerType = useRef("");
  const pointerEnteredAt = useRef(0);
  const setOpen = useCallback((open: boolean) => {
    if (!open) setValue("");
  }, []);
  useCloseOnNavigation(setOpen);

  const message = getCatalogMenuMessage(tree);
  const catalogActive = isHeaderNavActive(pathname, "/catalog");

  return (
    <NavigationMenu.Root
      aria-label="Разделы"
      value={value}
      onValueChange={setValue}
      className={cn("items-center", className)}
    >
      <NavigationMenu.List className="flex items-center gap-4">
        <NavigationMenu.Item value={CATALOG_VALUE}>
          <NavigationMenu.Trigger
            data-active={catalogActive ? "" : undefined}
            onPointerEnter={() => {
              pointerEnteredAt.current = Date.now();
            }}
            onPointerDown={(event) => {
              lastPointerType.current = event.pointerType;
            }}
            onClick={(event) => {
              // Наведение мышью только что открыло панель: клик сразу после него не должен её закрыть
              // (Radix переключает по клику). Позже клик закрывает, как обычно.
              const justHovered = Date.now() - pointerEnteredAt.current < HOVER_CLICK_GRACE_MS;
              if (value === CATALOG_VALUE && lastPointerType.current === "mouse" && justHovered) {
                event.preventDefault();
              }
            }}
            className={HEADER_NAV_ITEM_CLASS}
          >
            Каталог
            <ChevronDown
              aria-hidden
              className="size-4 transition-transform duration-200 in-data-[state=open]:rotate-180"
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content aria-label="Каталог">
            {message !== null || tree === null ? (
              <Container className="py-6">
                <p className="text-sm text-muted-foreground">{message}</p>
              </Container>
            ) : (
              <CatalogMenuPanel rubrics={tree} />
            )}
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {HEADER_NAV_LINKS.map((link) => (
          <NavigationMenu.Item key={link.href}>
            <NavigationMenu.Link asChild active={isHeaderNavActive(pathname, link.href)}>
              <Link href={link.href} className={HEADER_NAV_ITEM_CLASS}>
                {link.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <div className="absolute inset-x-0 top-full">
        <NavigationMenu.Viewport className="max-h-[calc(100dvh-80px)] w-full overflow-y-auto border-b bg-background shadow-lg" />
      </div>
    </NavigationMenu.Root>
  );
}
