import type { ListingSpecItem } from "@/lib/api";

/** Якорь блока «Характеристики» для ссылки «Все характеристики». */
export const LISTING_SPECS_ID = "specs";

/** Событие на блоке «Характеристики»: раскрыть его (ссылка «Все характеристики»). */
export const LISTING_SPECS_EXPAND_EVENT = "listing-specs:expand";

/**
 * Разряды с 5 цифр (`12 100`, но `2100`): год выпуска приходит обычным числом,
 * и с 4 цифр он стал бы «2 024» (решение владельца, 19 ноября 2026).
 */
const numberFormat = new Intl.NumberFormat("ru-RU", { useGrouping: "min2" });

/** «значение единица»: подписи вариантов и справочников бэкенд уже прислал, числа форматируем. */
export function formatSpecValue({ value, unit }: Pick<ListingSpecItem, "value" | "unit">): string {
  const text = typeof value === "number" ? numberFormat.format(value) : value;
  return unit ? `${text} ${unit}` : text;
}
