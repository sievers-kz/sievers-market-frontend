"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";
import type { CategoryTree } from "@/lib/api/catalog";

import { CatalogMenuMobile } from "./catalog-menu-mobile";
import { getCatalogMenuMessage } from "./catalog-menu-message";
import { CatalogMenuPanel } from "./catalog-menu-panel";
import { HEADER_NAV_ITEM_CLASS } from "./header-nav-item";

/**
 * Мега-меню каталога (docs/pages/mega-menu.md) и вместе с ним раскладка ряда шапки.
 * С `lg` ряд — сетка `1fr auto 1fr`: слева `logo`, по центру «Каталог» и `links` (точно по центру),
 * справа `actions`. «Каталог» открывает по клику немодальную панель (`Popover`) под шапкой шириной во весь
 * ряд: якорь панели это сам ряд, поэтому логотип, ссылки и действия приходят пропами.
 * Ниже `lg` центральной части нет, справа иконка `CatalogMenuMobile` (окно во весь экран) и `actions`.
 * `tree === null`: дерево не загрузилось, меню показывает сообщение.
 */
export function CatalogMegaMenu({
  tree,
  logo,
  links,
  actions,
}: {
  tree: CategoryTree | null;
  logo: ReactNode;
  links?: ReactNode;
  actions: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useCloseOnNavigation(setOpen);

  const message = getCatalogMenuMessage(tree);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="flex items-center gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center">{logo}</div>
          <nav aria-label="Разделы" className="hidden items-center gap-4 lg:flex">
            <PopoverTrigger asChild>
              <button type="button" className={HEADER_NAV_ITEM_CLASS}>
                Каталог
                <ChevronDown
                  aria-hidden
                  className="size-4 transition-transform duration-200 in-data-[state=open]:rotate-180"
                />
              </button>
            </PopoverTrigger>
            {links}
          </nav>
          <div className="ml-auto flex items-center justify-end gap-2 md:gap-4 lg:ml-0">
            <CatalogMenuMobile tree={tree} className="lg:hidden" />
            {actions}
          </div>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        sideOffset={24}
        aria-label="Каталог"
        className="flex max-h-[min(30rem,var(--radix-popover-content-available-height))] w-(--radix-popover-trigger-width) flex-col overflow-hidden rounded-2xl p-0"
      >
        {message !== null || tree === null ? (
          <p className="p-6 text-sm text-muted-foreground">{message}</p>
        ) : (
          <CatalogMenuPanel rubrics={tree} onNavigate={() => setOpen(false)} />
        )}
      </PopoverContent>
    </Popover>
  );
}
