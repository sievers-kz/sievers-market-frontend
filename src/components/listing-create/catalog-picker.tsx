"use client";

import { FormField } from "@/components/auth/form-field";
import type { components } from "@/lib/api/schema";

import { SelectField } from "./select-field";

type Rubric = components["schemas"]["RubricResponse"];

export interface CatalogSelection {
  rubricId: string;
  categoryId: string;
  subcategoryId: string;
}

export const EMPTY_SELECTION: CatalogSelection = { rubricId: "", categoryId: "", subcategoryId: "" };

interface CatalogPickerProps {
  tree: Rubric[];
  value: CatalogSelection;
  onChange: (value: CatalogSelection) => void;
  disabled?: boolean;
}

const toOptions = (items: readonly { id: string; name: string }[]) =>
  items.map((item) => ({ value: item.id, label: item.name }));

/** Каскад рубрика → категория → подкатегория; смена уровня сбрасывает нижние. */
export function CatalogPicker({ tree, value, onChange, disabled }: CatalogPickerProps) {
  const rubric = tree.find((item) => item.id === value.rubricId);
  const category = rubric?.categories.find((item) => item.id === value.categoryId);

  return (
    <section
      aria-label="Раздел каталога"
      className="grid gap-4 rounded-2xl bg-card p-6 md:grid-cols-3"
    >
      <FormField id="rubric" label="Рубрика" required>
        <SelectField
          id="rubric"
          value={value.rubricId}
          onChange={(rubricId) => onChange({ ...EMPTY_SELECTION, rubricId })}
          options={toOptions(tree)}
          placeholder="Выберите рубрику"
          disabled={disabled}
        />
      </FormField>
      <FormField id="category" label="Категория" required>
        <SelectField
          id="category"
          value={value.categoryId}
          onChange={(categoryId) => onChange({ ...value, categoryId, subcategoryId: "" })}
          options={toOptions(rubric?.categories ?? [])}
          placeholder="Выберите категорию"
          disabled={disabled || !rubric}
        />
      </FormField>
      <FormField id="subcategory" label="Подкатегория" required>
        <SelectField
          id="subcategory"
          value={value.subcategoryId}
          onChange={(subcategoryId) => onChange({ ...value, subcategoryId })}
          options={toOptions(category?.subcategories ?? [])}
          placeholder="Выберите подкатегорию"
          disabled={disabled || !category}
        />
      </FormField>
    </section>
  );
}
