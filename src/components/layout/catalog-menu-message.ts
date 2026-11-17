import type { CategoryTree } from "@/lib/api/catalog";

/** Текст вместо меню: дерево не загрузилось (`null`) или рубрик нет. */
export function getCatalogMenuMessage(tree: CategoryTree | null): string | null {
  if (tree === null) return "Каталог временно недоступен";
  if (tree.length === 0) return "Пока нет категорий";
  return null;
}
