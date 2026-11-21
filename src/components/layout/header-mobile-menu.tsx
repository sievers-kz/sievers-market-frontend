"use client";

import { Menu, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";
import { cn } from "@/lib/utils";

import type { CatalogMenuTree } from "./catalog-menu-tree";
import { MobileCatalogDrilldown } from "./mobile-catalog-drilldown";
import { SiteLogo } from "./site-logo";

/**
 * Бургер ниже `lg`: панель слева (`Sheet`) на весь экран (`sm:max-w-none` снимает `max-w-sm` из ui/sheet).
 * Сверху логотип и закрытие, ниже столбец экранов `MobileCatalogDrilldown`. Кабинета и входа здесь нет.
 */
export function HeaderMobileMenu({
  tree,
  className,
}: {
  tree: CatalogMenuTree | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useCloseOnNavigation(setOpen);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Меню"
          className={cn("text-foreground hover:bg-muted", className)}
        >
          <Menu aria-hidden className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        aria-describedby={undefined}
        className="w-full gap-0 sm:max-w-none"
      >
        <SheetTitle className="sr-only">Меню</SheetTitle>
        <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
          {/* Клик по логотипу на главной не меняет маршрут, поэтому закрываем явно. */}
          <div onClickCapture={close}>
            <SiteLogo />
          </div>
          <SheetClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Закрыть">
              <XIcon aria-hidden />
            </Button>
          </SheetClose>
        </div>
        <MobileCatalogDrilldown tree={tree} pathname={pathname} onNavigate={close} />
      </SheetContent>
    </Sheet>
  );
}
