import { Beef, House, Sprout, Tractor, Truck, type LucideIcon } from "lucide-react";

import { catalogCategoryHref } from "@/components/layout/catalog-menu-tree";
import type { CategoryTree } from "@/lib/api/catalog";

export interface HomeRubric {
  key: string;
  /** Название, по которому плитка сопоставляется с рубрикой из `getCategoryTree()`. */
  name: string;
  description: string;
  icon: LucideIcon;
}

/** Рубрики главной в фиксированном порядке (`docs/pages/home.md`, раздел 2). */
export const HOME_RUBRICS: readonly HomeRubric[] = [
  {
    key: "agrotechnika",
    name: "Сельхозтехника",
    description: "Тракторы, комбайны, сеялки и оборудование",
    icon: Tractor,
  },
  {
    key: "livestock",
    name: "Животноводство",
    description: "Скот, птица и оборудование для ферм",
    icon: Beef,
  },
  {
    key: "crops",
    name: "Растениеводство",
    description: "Семена, саженцы и защита растений",
    icon: Sprout,
  },
  { key: "services", name: "Услуги", description: "Перевозки, ремонт и аренда техники", icon: Truck },
  { key: "property", name: "Недвижимость", description: "Участки, фермы и склады", icon: House },
];

/** Рубрика, на которую ведёт «Смотреть каталог» в hero. */
export const HERO_CATALOG_RUBRIC = "Сельхозтехника";

/** Категории-чипы под поиском hero. Нет такой категории в дереве — нет чипа. */
export const HERO_CHIP_CATEGORIES = ["Тракторы", "Комбайны", "Сеялки", "Опрыскиватели"] as const;

/** Сравнение названий без регистра и пробелов по краям. */
function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Рубрика из дерева с тем же названием. У рубрик в API нет `slug`, поэтому сопоставление по
 * названию: переименование рубрики в базе отключит плитку (расхождение, см. спецификацию).
 */
export function findRubricByName(tree: CategoryTree | null, name: string) {
  return tree?.find((rubric) => sameName(rubric.name, name));
}

/**
 * Ссылка рубрики: у рубрики нет своей страницы, поэтому ведём на первую её категорию.
 * `null`, если рубрики нет в дереве или в ней нет категорий.
 */
export function rubricHref(tree: CategoryTree | null, name: string): string | null {
  const first = findRubricByName(tree, name)?.categories[0];
  return first ? catalogCategoryHref(first.id) : null;
}

/** Чипы hero: категории из `HERO_CHIP_CATEGORIES`, найденные в дереве по названию (в любой рубрике). */
export function heroChips(tree: CategoryTree | null): { label: string; href: string }[] {
  if (!tree) return [];
  const categories = tree.flatMap((rubric) => rubric.categories);
  return HERO_CHIP_CATEGORIES.flatMap((label) => {
    const category = categories.find((c) => sameName(c.name, label));
    return category ? [{ label, href: catalogCategoryHref(category.id) }] : [];
  });
}
