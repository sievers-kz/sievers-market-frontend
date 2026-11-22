import type { components } from "@/lib/api/schema";

import type { CatalogFilters, CatalogParams, NumberRange } from "./search-params";

/** Пункт выбора: значение уходит в URL и в `attributes` поиска. */
export interface FilterOption {
  value: string;
  label: string;
  /** Образец цвета (уже проверенный hex), только у справочника цветов. */
  swatch?: string;
}

/**
 * Атрибут подкатегории, готовый для панели фильтров. Собирается на сервере из
 * `getSubcategoryFilters` и справочников, в браузер уходит уже с подписями.
 * `enumerate` и `reference` → выбор, `boolean` → галочка, `integer` и `float` → диапазон «от–до»;
 * строки не рисуем.
 */
export type FilterField =
  | {
      kind: "select";
      key: string;
      label: string;
      /** Первый пункт: «Любое» у `enumerate`, «Любой» у `reference`. */
      anyLabel: string;
      options: readonly FilterOption[];
    }
  | { kind: "boolean"; key: string; label: string }
  | {
      kind: "range";
      key: string;
      /** Подпись без единицы: для чипа («Мощность: от 150 л. с.»). */
      label: string;
      /** Единица из `field.unit` («л. с.»), если есть. */
      unit: string | null;
      /** `float`: можно дробную часть; `integer`: только целые. */
      decimal: boolean;
    };

/** Заголовок карточки: «Мощность, л. с.», без единицы просто подпись. */
export function filterFieldTitle(field: FilterField): string {
  return field.kind === "range" && field.unit ? `${field.label}, ${field.unit}` : field.label;
}

export interface CityOption {
  id: string;
  name: string;
}

/** Данные для разбора и подписей фильтров. `null`: не загрузилось (или не нужно). */
export interface CatalogFilterData {
  cities: readonly CityOption[] | null;
  /** `null` без подкатегории или при ошибке `getSubcategoryFilters`. */
  fields: readonly FilterField[] | null;
}

/** Значение галочки в URL: `f.<ключ>=true`; снятая галочка = параметра нет. */
export const BOOLEAN_TRUE = "true";

function isAllowedValue(field: FilterField, value: string): boolean {
  if (field.kind === "boolean") return value === BOOLEAN_TRUE;
  if (field.kind === "select") return field.options.some((option) => option.value === value);
  // У числовых атрибутов только диапазон (`f.<ключ>.min`, `.max`), равенства нет.
  return false;
}

/** У `integer` дробная граница отбрасывается (бэкенд сравнивает с целыми). */
function allowedRange(field: FilterField, range: NumberRange): NumberRange | null {
  if (field.kind !== "range") return null;
  const fits = (bound: number | undefined) =>
    bound !== undefined && (field.decimal || Number.isInteger(bound)) ? bound : undefined;
  const min = fits(range.min);
  const max = fits(range.max);
  return min === undefined && max === undefined ? null : { min, max };
}

/**
 * Отсекает то, чего нет в данных: атрибуты и диапазоны только известных ключей выбранной
 * подкатегории с допустимым значением (иначе бэкенд ответит 422), порядок как у полей.
 * Диапазон только у числовых атрибутов. Город только из справочника, если он загрузился.
 */
export function sanitizeCatalogParams(params: CatalogParams, data: CatalogFilterData): CatalogParams {
  const raw = params.attributes ?? {};
  const rawRanges = params.ranges ?? {};
  const attributes: Record<string, string> = {};
  const ranges: Record<string, NumberRange> = {};
  if (params.subcategoryId && data.fields) {
    for (const field of data.fields) {
      if (Object.hasOwn(raw, field.key)) {
        const value = raw[field.key];
        if (isAllowedValue(field, value)) attributes[field.key] = value;
      }
      if (Object.hasOwn(rawRanges, field.key)) {
        const range = allowedRange(field, rawRanges[field.key]);
        if (range) ranges[field.key] = range;
      }
    }
  }

  const cityKnown = !data.cities || data.cities.some((city) => city.id === params.cityId);

  return {
    ...params,
    cityId: params.cityId && cityKnown ? params.cityId : undefined,
    attributes,
    ranges,
  };
}

/** Тело `attributes` для `searchListing`: галочка уходит булевым `true`, как из формы объявления. */
export function toSearchAttributes(
  attributes: CatalogFilters["attributes"],
): Record<string, string | boolean> {
  return Object.fromEntries(
    Object.entries(attributes ?? {}).map(([key, value]) => [key, value === BOOLEAN_TRUE ? true : value]),
  );
}

/** Тело `attribute_ranges` для `searchListing`: отсутствующая граница уходит `null`. */
export function toSearchRanges(
  ranges: CatalogFilters["ranges"],
): Record<string, components["schemas"]["NumericRange"]> {
  return Object.fromEntries(
    Object.entries(ranges ?? {}).map(([key, { min, max }]) => [key, { min: min ?? null, max: max ?? null }]),
  );
}

const numberFormat = new Intl.NumberFormat("ru-RU");

/**
 * Числа атрибутов: разряды с пяти цифр, как принято в русском наборе («2015», «15 000»),
 * иначе год выглядел бы «2 015». Дробная часть через запятую.
 */
const attributeNumberFormat = new Intl.NumberFormat("ru-RU", {
  useGrouping: "min2",
  maximumFractionDigits: 6,
});

/** «2015–2020», «от 150 л. с.», «до 200 л. с.», «100–200 л. с.». */
export function formatAttributeRange(range: NumberRange, unit: string | null): string {
  const min = range.min !== undefined ? attributeNumberFormat.format(range.min) : undefined;
  const max = range.max !== undefined ? attributeNumberFormat.format(range.max) : undefined;
  const text =
    min !== undefined && max !== undefined
      ? `${min}–${max}`
      : min !== undefined
        ? `от ${min}`
        : `до ${max}`;
  return unit ? `${text} ${unit}` : text;
}

/** «Цена: от 1 000 000 до 5 000 000 ₸», «Цена: от 1 000 ₸», «Цена: до 5 000 ₸». */
export function formatPriceRange(min: number | undefined, max: number | undefined): string {
  const parts = [
    min !== undefined ? `от ${numberFormat.format(min)}` : null,
    max !== undefined ? `до ${numberFormat.format(max)}` : null,
  ].filter(Boolean);
  return `Цена: ${parts.join(" ")} ₸`;
}

export interface FilterChip {
  id: string;
  label: string;
  /** Параметры без этого фильтра (страница 1). */
  params: CatalogParams;
}

/** Выбранные фильтры чипами: цена, город, атрибуты и диапазоны в порядке полей. Подкатегория и сортировка не чипы. */
export function getFilterChips(params: CatalogParams, data: CatalogFilterData): FilterChip[] {
  const base: CatalogParams = { ...params, page: 1 };
  const chips: FilterChip[] = [];

  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    chips.push({
      id: "price",
      label: formatPriceRange(params.priceMin, params.priceMax),
      params: { ...base, priceMin: undefined, priceMax: undefined },
    });
  }

  if (params.cityId) {
    const city = data.cities?.find((item) => item.id === params.cityId);
    chips.push({
      id: "city",
      label: city?.name ?? "Город",
      params: { ...base, cityId: undefined },
    });
  }

  const attributes = params.attributes ?? {};
  const ranges = params.ranges ?? {};
  for (const field of data.fields ?? []) {
    if (field.kind === "range") {
      if (!Object.hasOwn(ranges, field.key)) continue;
      const rest = Object.fromEntries(Object.entries(ranges).filter(([key]) => key !== field.key));
      chips.push({
        id: `f.${field.key}`,
        label: `${field.label}: ${formatAttributeRange(ranges[field.key], field.unit)}`,
        params: { ...base, ranges: rest },
      });
      continue;
    }
    if (!Object.hasOwn(attributes, field.key)) continue;
    const value = attributes[field.key];
    const rest = Object.fromEntries(Object.entries(attributes).filter(([key]) => key !== field.key));
    const optionLabel =
      field.kind === "select" ? field.options.find((option) => option.value === value)?.label : null;
    chips.push({
      id: `f.${field.key}`,
      label: optionLabel ? `${field.label}: ${optionLabel}` : field.label,
      params: { ...base, attributes: rest },
    });
  }

  return chips;
}
