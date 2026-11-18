"use client";

import { SlidersHorizontal, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";

import { CatalogFilterForm, type CatalogFilterFormProps } from "./catalog-filter-form";

interface CatalogFiltersDialogProps extends Omit<CatalogFilterFormProps, "onNavigate"> {
  /** Число выбранных фильтров (как чипов): «Фильтры · 3». */
  count: number;
}

/** Ниже `lg`: кнопка «Фильтры» открывает ту же форму во весь экран; «Показать» применяет и закрывает. */
export function CatalogFiltersDialog({ count, ...formProps }: CatalogFiltersDialogProps) {
  const [open, setOpen] = useState(false);
  useCloseOnNavigation(setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full bg-card lg:hidden">
          <SlidersHorizontal aria-hidden />
          {count > 0 ? `Фильтры · ${count}` : "Фильтры"}
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="inset-0 top-0 left-0 flex h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0 sm:max-w-none"
      >
        <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
          <DialogTitle>Фильтры</DialogTitle>
          <DialogClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Закрыть">
              <XIcon aria-hidden />
            </Button>
          </DialogClose>
        </div>
        <CatalogFilterForm
          {...formProps}
          onNavigate={() => setOpen(false)}
          fieldsClassName="min-h-0 flex-1 overflow-y-auto bg-muted p-4"
          actionsClassName="shrink-0 rounded-none border-t"
        />
      </DialogContent>
    </Dialog>
  );
}
