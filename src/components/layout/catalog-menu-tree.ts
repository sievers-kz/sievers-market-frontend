import { buildCatalogHref, categoryScope } from "@/components/catalog/search-params";
import type { CategoryTree } from "@/lib/api/catalog";

/**
 * Дерево каталога для меню шапки (десктопное мега-меню и мобильный бургер): только id и названия.
 * Собирается на сервере из `getCategoryTree()`, в клиент уходит без лишних полей.
 */
export interface CatalogMenuSubcategory {
  id: string;
  name: string;
}
export interface CatalogMenuCategory {
  id: string;
  name: string;
  subcategories: CatalogMenuSubcategory[];
}
export interface CatalogMenuRubric {
  id: string;
  name: string;
  categories: CatalogMenuCategory[];
}
export type CatalogMenuTree = CatalogMenuRubric[];

export function toCatalogMenuTree(tree: CategoryTree): CatalogMenuTree {
  return tree.map((rubric) => ({
    id: rubric.id,
    name: rubric.name,
    categories: rubric.categories.map((category) => ({
      id: category.id,
      name: category.name,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
      })),
    })),
  }));
}

/** Ссылка на страницу категории. У рубрики своей страницы нет. */
export function catalogCategoryHref(categoryId: string): string {
  return buildCatalogHref(categoryScope(categoryId), { page: 1, view: "grid" });
}

/** Ссылка на подкатегорию: страница категории с `?subcategory=`. */
export function catalogSubcategoryHref(categoryId: string, subcategoryId: string): string {
  return buildCatalogHref(categoryScope(categoryId), { subcategoryId, page: 1, view: "grid" });
}
