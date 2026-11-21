"use client";

import { Menu, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { buildCatalogHref, categoryScope } from "@/components/catalog/search-params";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";
import type { CategoryTree } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

import { getCatalogMenuMessage } from "./catalog-menu-message";
import { HEADER_NAV_LINKS, isHeaderNavActive } from "./header-nav-links";
import { MobileAccountSection } from "./mobile-account-section";

const LINK =
  "flex min-h-10 items-center rounded-sm py-2 text-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/**
 * Меню ниже `lg`: бургер открывает окно во весь экран. Внутри каталог аккордеоном
 * рубрика → категория → подкатегории, разделы шапки («Организации», «О нас», «Поддержка»)
 * и «Личный кабинет» (гостю «Войти»).
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Меню"
          className={cn("text-foreground hover:bg-muted", className)}
        >
          <Menu aria-hidden className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="inset-0 top-0 left-0 flex h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0 sm:max-w-none"
      >
        <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
          <DialogTitle>Меню</DialogTitle>
          <DialogClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Закрыть">
              <XIcon aria-hidden />
            </Button>
          </DialogClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <h2 className="pt-4 text-xs font-medium text-muted-foreground">Каталог</h2>
          {message !== null || tree === null ? (
            <p className="py-4 text-sm text-muted-foreground">{message}</p>
          ) : (
            <Accordion type="multiple" defaultValue={tree[0] ? [tree[0].id] : []}>
              {tree.map((rubric) => (
                <AccordionItem key={rubric.id} value={rubric.id}>
                  <AccordionTrigger className="text-base font-semibold">{rubric.name}</AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <Accordion type="multiple">
                      {rubric.categories.map((category) => {
                        const categoryHref = buildCatalogHref(categoryScope(category.id), { page: 1, view: "grid" });
                        if (category.subcategories.length === 0) {
                          return (
                            <div key={category.id} className="border-b last:border-b-0">
                              {/* py-4 как у AccordionTrigger, чтобы строки были одной высоты. */}
                              <Link href={categoryHref} onClick={close} className={cn(LINK, "py-4 font-medium")}>
                                {category.name}
                              </Link>
                            </div>
                          );
                        }
                        return (
                          <AccordionItem key={category.id} value={category.id}>
                            <AccordionTrigger>{category.name}</AccordionTrigger>
                            <AccordionContent className="pl-4">
                              <ul>
                                <li>
                                  <Link href={categoryHref} onClick={close} className={cn(LINK, "font-medium")}>
                                    Все в категории
                                  </Link>
                                </li>
                                {category.subcategories.map((subcategory) => (
                                  <li key={subcategory.id}>
                                    <Link
                                      href={buildCatalogHref(categoryScope(category.id), {
                                        subcategoryId: subcategory.id,
                                        page: 1,
                                        view: "grid",
                                      })}
                                      onClick={close}
                                      className={cn(LINK, "text-muted-foreground")}
                                    >
                                      {subcategory.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <nav aria-label="Разделы" className="border-t py-4">
            <ul>
              {HEADER_NAV_LINKS.map((link) => {
                const active = isHeaderNavActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(LINK, "text-base font-medium", active && "text-primary")}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <MobileAccountSection pathname={pathname} onNavigate={close} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
