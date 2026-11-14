"use client";

import { LayoutGrid } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";
import type { CategoryTree } from "@/lib/api/catalog";

import { CatalogMenuMobile } from "./catalog-menu-mobile";
import { getCatalogMenuMessage } from "./catalog-menu-message";
import { CatalogMenuPanel } from "./catalog-menu-panel";

/**
 * Мега-меню каталога в нижнем ряду шапки (docs/pages/mega-menu.md).
 * С `lg` кнопка открывает немодальную панель (`Popover`) под шапкой шириной во весь ряд:
 * якорь панели это сам ряд, поэтому остальные элементы ряда приходят через `children`.
 * Ниже `lg` работает `CatalogMenuMobile` (окно во весь экран).
 * `tree === null`: дерево не загрузилось, меню показывает сообщение.
 */
export function CatalogMegaMenu({
  tree,
  children,
}: {
  tree: CategoryTree | null;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useCloseOnNavigation(setOpen);

  const message = getCatalogMenuMessage(tree);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="flex items-center gap-4">
          <PopoverTrigger asChild>
            <Button type="button" size="lg" className="hidden px-6 lg:inline-flex">
              <LayoutGrid aria-hidden />
              Каталог
            </Button>
          </PopoverTrigger>
          <CatalogMenuMobile tree={tree} className="lg:hidden" />
          {children}
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
