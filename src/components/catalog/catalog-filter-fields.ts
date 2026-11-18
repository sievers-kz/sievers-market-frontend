import type { CatalogFilters, CatalogParams } from "./search-params";

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
 * `enumerate` и `reference` → выбор, `boolean` → галочка; числа и строки в PR 1 не рисуем.
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
  | { kind: "boolean"; key: string; label: string };

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
  return field.kind === "boolean"
    ? value === BOOLEAN_TRUE
    : field.options.some((option) => option.value === value);
}

/**
 * Отсекает то, чего нет в данных: атрибуты только известных ключей выбранной подкатегории
 * с допустимым значением (иначе бэкенд ответит 422), порядок как у полей. Город только из
 * справочника, если он загрузился.
 */
export function sanitizeCatalogParams(params: CatalogParams, data: CatalogFilterData): CatalogParams {
  const raw = params.attributes ?? {};
  const attributes: Record<string, string> = {};
  if (params.subcategoryId && data.fields) {
    for (const field of data.fields) {
      if (!Object.hasOwn(raw, field.key)) continue;
      const value = raw[field.key];
      if (isAllowedValue(field, value)) attributes[field.key] = value;
    }
  }

  const cityKnown = !data.cities || data.cities.some((city) => city.id === params.cityId);

  return {
    ...params,
    cityId: params.cityId && cityKnown ? params.cityId : undefined,
    attributes,
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

const numberFormat = new Intl.NumberFormat("ru-RU");

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

/** Выбранные фильтры чипами: цена, город, атрибуты в порядке полей. Подкатегория и сортировка не чипы. */
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
  for (const field of data.fields ?? []) {
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
