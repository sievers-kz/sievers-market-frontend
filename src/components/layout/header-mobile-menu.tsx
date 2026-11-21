"use client";

import { Menu, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { buildCatalogHref, categoryScope } from "@/components/catalog/search-params";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";
import type { CategoryTree } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

import { getCatalogMenuMessage } from "./catalog-menu-message";
import { HEADER_NAV_LINKS, isHeaderNavActive } from "./header-nav-links";
import { PostListingButton } from "./post-listing-button";

const ROW =
  "flex min-h-10 items-center rounded-sm py-2 text-base font-medium transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
const SUB_LINK =
  "flex min-h-10 items-center rounded-sm py-2 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/**
 * Бургер ниже `lg`: панель слева (`Sheet`) только с разделами сайта и «Подать объявление».
 * Общей страницы каталога (`/catalog`) нет, поэтому «Каталог» — свёрнутый аккордеон на один уровень:
 * рубрики подписями, под ними категории ссылками. Подкатегорий здесь нет. Кабинет — в `MobileAccountSheet`.
 */
export function HeaderMobileMenu({
  tree,
  className,
}: {
  tree: CategoryTree | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useCloseOnNavigation(setOpen);

  const message = getCatalogMenuMessage(tree);
  const close = () => setOpen(false);
  const catalogActive = isHeaderNavActive(pathname, "/catalog");

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
      <SheetContent side="left" showCloseButton={false} aria-describedby={undefined} className="gap-0">
        <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
          <SheetTitle>Меню</SheetTitle>
          <SheetClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Закрыть">
              <XIcon aria-hidden />
            </Button>
          </SheetClose>
        </div>

        <nav aria-label="Разделы" className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="catalog" className="border-b-0">
              <AccordionTrigger
                className={cn("py-2 text-base hover:text-primary hover:no-underline", catalogActive && "text-primary")}
              >
                Каталог
              </AccordionTrigger>
              <AccordionContent className="pb-2 pl-4">
                {message !== null || tree === null ? (
                  <p className="py-2 text-sm text-muted-foreground">{message}</p>
                ) : (
                  tree.map((rubric) => (
                    <div key={rubric.id} className="py-2">
                      <p className="text-xs font-medium text-muted-foreground">{rubric.name}</p>
                      <ul>
                        {rubric.categories.map((category) => (
                          <li key={category.id}>
                            <Link
                              href={buildCatalogHref(categoryScope(category.id), { page: 1, view: "grid" })}
                              onClick={close}
                              className={SUB_LINK}
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <ul>
            {HEADER_NAV_LINKS.map((link) => {
              const active = isHeaderNavActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(ROW, active && "text-primary")}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t p-4">
          <PostListingButton variant="outline" alwaysShowLabel onClick={close} className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
