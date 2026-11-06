import { apiFetch } from "./client";
import type { components, operations } from "./schema";

type CategoryTree =
  operations["getCategoryTree"]["responses"][200]["content"]["application/json"];
type RubricResponse = components["schemas"]["RubricResponse"];
type CategoryResponse = components["schemas"]["CategoryResponse"];

/** Справочник меняется редко: кэшируем на час. */
const TREE_REVALIDATE_SECONDS = 3600;

export function getCategoryTree(): Promise<CategoryTree> {
  return apiFetch<CategoryTree>("/api/v1/catalog/tree", {
    next: { revalidate: TREE_REVALIDATE_SECONDS },
  });
}

/** Категория вместе с рубрикой, в которую она входит. */
export function findCategory(
  tree: CategoryTree,
  categoryId: string,
): { rubric: RubricResponse; category: CategoryResponse } | undefined {
  for (const rubric of tree) {
    const category = rubric.categories.find((c) => c.id === categoryId);
    if (category) return { rubric, category };
  }
  return undefined;
}

type SubcategoryForm =
  operations["getSubcategoryForm"]["responses"][200]["content"]["application/json"];

/** Группы и поля формы подкатегории (динамические атрибуты объявления). */
export function getSubcategoryForm(
  subcategoryId: string,
  signal?: AbortSignal,
): Promise<SubcategoryForm> {
  return apiFetch<SubcategoryForm>(
    `/api/v1/catalog/${encodeURIComponent(subcategoryId)}/form`,
    { signal },
  );
}
