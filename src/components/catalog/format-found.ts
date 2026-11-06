const plural = new Intl.PluralRules("ru-RU");

const FORMS: Record<string, string> = {
  one: "объявление",
  few: "объявления",
  many: "объявлений",
  other: "объявления",
};

/** «Найдено 1 объявление», «Найдено 3 объявления», «Найдено 12 объявлений». */
export function formatFound(total: number): string {
  const count = new Intl.NumberFormat("ru-RU").format(total);
  return `Найдено ${count} ${FORMS[plural.select(total)]}`;
}
