const plural = new Intl.PluralRules("ru-RU");
const numberFormat = new Intl.NumberFormat("ru-RU");

type Forms = Record<"one" | "few" | "many", string>;

const ORGANIZATION_FORMS: Forms = {
  one: "организация",
  few: "организации",
  many: "организаций",
};

const LISTING_FORMS: Forms = {
  one: "объявление",
  few: "объявления",
  many: "объявлений",
};

/** Целые числа в ru-RU дают только `one`, `few`, `many`; `other` (дроби) сводим к `few`. */
function pluralize(count: number, forms: Forms): string {
  const rule = plural.select(count);
  const form = rule === "one" || rule === "many" ? forms[rule] : forms.few;
  return `${numberFormat.format(count)} ${form}`;
}

/** «Найдено: 1 организация», «Найдено: 3 организации», «Найдено: 12 организаций». */
export function formatOrganizationsFound(total: number): string {
  return `Найдено: ${pluralize(total, ORGANIZATION_FORMS)}`;
}

/** «1 объявление», «3 объявления», «11 объявлений». Ноль обрабатывает карточка. */
export function formatListingsCount(count: number): string {
  return pluralize(count, LISTING_FORMS);
}
