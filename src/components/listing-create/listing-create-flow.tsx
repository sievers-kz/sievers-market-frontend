"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getSubcategoryForm } from "@/lib/api";
import type { components } from "@/lib/api/schema";

import type { ReferenceSources } from "./attribute-field-input";
import { CatalogPicker, EMPTY_SELECTION, type CatalogSelection } from "./catalog-picker";
import { FormSectionsSkeleton } from "./form-sections-skeleton";
import { ListingForm } from "./listing-form";
import { ListingHints } from "./listing-hints";
import { sortGroups, type AttributeGroup } from "./listing-schema";
import { useImageUploads } from "./use-image-uploads";

type Rubric = components["schemas"]["RubricResponse"];

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; groups: AttributeGroup[] };

export interface ListingCreateData {
  tree: Rubric[];
  cities: readonly { id: string; name: string }[];
  references: ReferenceSources;
}

export function ListingCreateFlow({ tree, cities, references }: ListingCreateData) {
  const [selection, setSelection] = useState<CatalogSelection>(EMPTY_SELECTION);
  const [formState, setFormState] = useState<FormState>({ status: "idle" });
  const requestRef = useRef<AbortController | null>(null);
  // Выше формы: смена подкатегории пересоздаёт форму, но не трогает загруженные фото.
  const uploads = useImageUploads();

  function loadForm(subcategoryId: string) {
    requestRef.current?.abort();
    if (!subcategoryId) {
      setFormState({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setFormState({ status: "loading" });
    getSubcategoryForm(subcategoryId, controller.signal).then(
      (form) => {
        if (!controller.signal.aborted) {
          setFormState({ status: "ready", groups: sortGroups(form.groups) });
        }
      },
      () => {
        if (!controller.signal.aborted) setFormState({ status: "error" });
      },
    );
  }

  function handleSelectionChange(next: CatalogSelection) {
    setSelection(next);
    if (next.subcategoryId !== selection.subcategoryId) loadForm(next.subcategoryId);
  }

  return (
    <div className="flex flex-col gap-6">
      <CatalogPicker tree={tree} value={selection} onChange={handleSelectionChange} />

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          {formState.status === "idle" && (
            <p className="rounded-2xl bg-card p-6 text-center text-muted-foreground">
              Выберите подкатегорию, чтобы заполнить объявление
            </p>
          )}
          {formState.status === "loading" && <FormSectionsSkeleton />}
          {formState.status === "error" && (
            <div
              role="alert"
              className="flex flex-col items-center gap-4 rounded-2xl bg-card p-6 text-center"
            >
              <p>Не удалось загрузить поля подкатегории.</p>
              <Button type="button" onClick={() => loadForm(selection.subcategoryId)}>
                Повторить
              </Button>
            </div>
          )}
          {formState.status === "ready" && (
            // key: смена подкатегории начинает форму заново (кроме фото).
            <ListingForm
              key={selection.subcategoryId}
              categoryId={selection.categoryId}
              subcategoryId={selection.subcategoryId}
              groups={formState.groups}
              cities={cities}
              references={references}
              uploads={uploads}
            />
          )}
        </div>
        <ListingHints />
      </div>
    </div>
  );
}
