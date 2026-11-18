import type { ListingSearchSort } from "@/lib/api/listing";

export type CatalogView = "grid" | "list";

/** `newest` это порядок по умолчанию: в URL и в параметрах его нет. */
export type CatalogSort = Exclude<ListingSearchSort, "newest">;

export const CATALOG_SORTS = ["price_asc", "price_desc"] as const satisfies readonly CatalogSort[];

/** Префикс параметров атрибутов: `f.condition=used`, `f.brand=<uuid>`. */
export const ATTRIBUTE_PARAM_PREFIX = "f.";

export interface CatalogFilters {
  priceMin?: number;
  priceMax?: number;
  cityId?: string;
  sort?: CatalogSort;
  /**
   * Атрибуты подкатегории: ключ → значение из URL (у `boolean` это `"true"`).
   * После `sanitizeCatalogParams` только ключи и значения, разрешённые подкатегорией.
   */
  attributes?: Readonly<Record<string, string>>;
}

export interface CatalogParams extends CatalogFilters {
  subcategoryId?: string;
  page: number;
  view: CatalogView;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string | undefined): value is string {
  return value !== undefined && UUID_RE.test(value);
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Цена: только цифры, целое ≥ 0 в пределах безопасного целого. Иначе `undefined`. */
export function parsePrice(value: string | undefined): number | undefined {
  const raw = value?.trim();
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const price = Number(raw);
  return Number.isSafeInteger(price) ? price : undefined;
}

function parseSort(value: string | undefined): CatalogSort | undefined {
  return CATALOG_SORTS.find((sort) => sort === value);
}

/**
 * Разбор адреса каталога: `subcategory`, `page`, `view`, `price_min`, `price_max`, `city`,
 * `sort`, `f.<ключ>`. Некорректные значения молча отбрасываются (или заменяются значениями
 * по умолчанию). Атрибуты здесь проверяются только по форме: допустимые ключи и значения
 * знает `getSubcategoryFilters`, их отсекает `sanitizeCatalogParams` на странице.
 */
export function parseCatalogParams(searchParams: RawSearchParams): CatalogParams {
  const rawPage = Number(first(searchParams.page));
  const rawSubcategory = first(searchParams.subcategory);
  const rawCity = first(searchParams.city);

  let priceMin = parsePrice(first(searchParams.price_min));
  let priceMax = parsePrice(first(searchParams.price_max));
  if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
    [priceMin, priceMax] = [priceMax, priceMin];
  }

  const attributes: Record<string, string> = {};
  for (const [name, value] of Object.entries(searchParams)) {
    if (!name.startsWith(ATTRIBUTE_PARAM_PREFIX)) continue;
    const key = name.slice(ATTRIBUTE_PARAM_PREFIX.length);
    const attributeValue = first(value)?.trim();
    if (key && attributeValue) attributes[key] = attributeValue;
  }

  return {
    // Подкатегорию по форме не проверяем: чужой id даёт 404 на странице, как раньше.
    subcategoryId: rawSubcategory || undefined,
    page: Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1,
    view: first(searchParams.view) === "list" ? "list" : "grid",
    priceMin,
    priceMax,
    cityId: isUuid(rawCity) ? rawCity : undefined,
    sort: parseSort(first(searchParams.sort)),
    attributes,
  };
}

/** Есть ли фильтр (цена, город, атрибут). Подкатегория и сортировка фильтром не считаются. */
export function hasCatalogFilters(params: CatalogFilters): boolean {
  return (
    params.priceMin !== undefined ||
    params.priceMax !== undefined ||
    params.cityId !== undefined ||
    Object.keys(params.attributes ?? {}).length > 0
  );
}

/** Нужен ли поиск (`searchListing`) вместо обычного списка (`getListingsCatalog`). */
export function needsCatalogSearch(params: CatalogFilters): boolean {
  return hasCatalogFilters(params) || params.sort !== undefined;
}

/** Без цены, города, атрибутов и сортировки, на первой странице; подкатегория и вид остаются. */
export function resetCatalogFilters(params: CatalogParams): CatalogParams {
  return { subcategoryId: params.subcategoryId, page: 1, view: params.view };
}

/** Другая подкатегория: атрибуты сбрасываются (у неё свои), цена, город и сортировка остаются. */
export function withSubcategory(params: CatalogParams, subcategoryId: string | undefined): CatalogParams {
  return { ...params, subcategoryId, attributes: undefined, page: 1 };
}

/** Ссылка на каталог. Значения по умолчанию (`page=1`, `view=grid`, без сортировки) не пишем. */
export function buildCatalogHref(categoryId: string, params: CatalogParams): string {
  const query = new URLSearchParams();
  if (params.subcategoryId) query.set("subcategory", params.subcategoryId);
  if (params.priceMin !== undefined) query.set("price_min", String(params.priceMin));
  if (params.priceMax !== undefined) query.set("price_max", String(params.priceMax));
  if (params.cityId) query.set("city", params.cityId);
  if (params.sort) query.set("sort", params.sort);
  for (const [key, value] of Object.entries(params.attributes ?? {})) {
    query.set(`${ATTRIBUTE_PARAM_PREFIX}${key}`, value);
  }
  if (params.page > 1) query.set("page", String(params.page));
  if (params.view !== "grid") query.set("view", params.view);
  const search = query.toString();
  return `/catalog/${categoryId}${search ? `?${search}` : ""}`;
}
