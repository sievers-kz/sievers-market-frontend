import type { MyListingsQuery, MyListingsSort, MyListingsStatus } from "@/lib/api";

export const MY_LISTINGS_PATH = "/account/listings";

/** Размер страницы (бэкенд допускает 1–50). */
const PAGE_SIZE = 20;

const STATUSES: readonly MyListingsStatus[] = ["active", "inactive", "archived"];
const SORTS: readonly MyListingsSort[] = ["newest", "oldest"];
const DEFAULT_SORT: MyListingsSort = "newest";

export interface MyListingsParams {
  /** `undefined` — вкладка «Все». */
  status?: MyListingsStatus;
  organizationId?: string;
  categoryId?: string;
  sort: MyListingsSort;
  page: number;
}

function isOneOf<T extends string>(list: readonly T[], value: string | null): value is T {
  return value !== null && (list as readonly string[]).includes(value);
}

/**
 * Разбор `?status=&organization_id=&category_id=&sort=&page=`. Неизвестный статус — «Все»,
 * неизвестная сортировка — `newest`, страница не число или меньше 1 — первая.
 * Правильность uuid проверяет бэкенд (422).
 */
export function parseMyListingsParams(searchParams: Pick<URLSearchParams, "get">): MyListingsParams {
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");
  const rawPage = Number(searchParams.get("page"));
  return {
    status: isOneOf(STATUSES, status) ? status : undefined,
    organizationId: searchParams.get("organization_id") || undefined,
    categoryId: searchParams.get("category_id") || undefined,
    sort: isOneOf(SORTS, sort) ? sort : DEFAULT_SORT,
    page: Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1,
  };
}

/** Ссылка на страницу. Значения по умолчанию (`sort=newest`, `page=1`) в URL не пишем. */
export function buildMyListingsHref(params: MyListingsParams): string {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.organizationId) query.set("organization_id", params.organizationId);
  if (params.categoryId) query.set("category_id", params.categoryId);
  if (params.sort !== DEFAULT_SORT) query.set("sort", params.sort);
  if (params.page > 1) query.set("page", String(params.page));
  const search = query.toString();
  return `${MY_LISTINGS_PATH}${search ? `?${search}` : ""}`;
}

/** Выбран ли фильтр (статус, организация, категория). Сортировка и страница фильтром не считаются. */
export function hasMyListingsFilters(params: MyListingsParams): boolean {
  return Boolean(params.status || params.organizationId || params.categoryId);
}

/** Параметры запроса `getMyListings`. */
export function toMyListingsQuery(params: MyListingsParams): MyListingsQuery {
  return {
    status: params.status,
    organization_id: params.organizationId,
    category_id: params.categoryId,
    sort: params.sort,
    page: params.page,
    limit: PAGE_SIZE,
  };
}
