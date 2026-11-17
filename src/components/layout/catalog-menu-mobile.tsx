"use client";

import { LayoutGrid, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { buildCatalogHref } from "@/components/catalog/search-params";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";
import type { CategoryTree } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

import { getCatalogMenuMessage } from "./catalog-menu-message";

const LINK =
  "flex min-h-10 items-center rounded-sm py-2 text-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** Каталог ниже `lg`: кнопка открывает окно во весь экран с аккордеоном рубрика → категория → подкатегории. */
export function CatalogMenuMobile({
  tree,
  className,
}: {
  tree: CategoryTree | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  useCloseOnNavigation(setOpen);

  const message = getCatalogMenuMessage(tree);
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="lg" aria-label="Каталог" className={cn("px-4 md:px-6", className)}>
          <LayoutGrid aria-hidden />
          <span className="hidden md:inline">Каталог</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="inset-0 top-0 left-0 flex h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0 sm:max-w-none"
      >
        <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
          <DialogTitle>Каталог</DialogTitle>
          <DialogClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Закрыть">
              <XIcon aria-hidden />
            </Button>
          </DialogClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {message !== null || tree === null ? (
            <p className="py-6 text-sm text-muted-foreground">{message}</p>
          ) : (
            <Accordion type="multiple" defaultValue={tree[0] ? [tree[0].id] : []}>
              {tree.map((rubric) => (
                <AccordionItem key={rubric.id} value={rubric.id}>
                  <AccordionTrigger className="text-base font-semibold">{rubric.name}</AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <Accordion type="multiple">
                      {rubric.categories.map((category) => {
                        const categoryHref = buildCatalogHref(category.id, { page: 1, view: "grid" });
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
                                      href={buildCatalogHref(category.id, {
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
