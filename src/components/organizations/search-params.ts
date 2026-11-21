/** 16 = 4 ряда по 4 на десктопе и 8 рядов по 2 на телефоне, без «висячего» ряда. */
export const ORGANIZATIONS_PAGE_SIZE = 16;

/** Ограничение `q` в OpenAPI (`maxLength: 100`). */
export const ORGANIZATIONS_QUERY_MAX_LENGTH = 100;

const BASE_PATH = "/organizations";

export interface OrganizationsParams {
  /** Текст поиска без пробелов по краям, не длиннее 100 символов; пустой не передаётся. */
  q?: string;
  page: number;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Текст поиска из URL или поля формы: обрезка пробелов и длины; пустой → `undefined`. */
export function parseOrganizationsQuery(
  value: string | string[] | undefined,
): string | undefined {
  const text = first(value)?.trim().slice(0, ORGANIZATIONS_QUERY_MAX_LENGTH).trim();
  return text || undefined;
}

/** Номер страницы: целое ≥ 1, иначе 1. */
function parsePage(value: string | undefined): number {
  const raw = value?.trim();
  if (!raw || !/^\d+$/.test(raw)) return 1;
  const page = Number(raw);
  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
}

/** Разбор адреса `/organizations?q=&page=`. Некорректные значения заменяются значениями по умолчанию. */
export function parseOrganizationsParams(searchParams: RawSearchParams): OrganizationsParams {
  return {
    q: parseOrganizationsQuery(searchParams.q),
    page: parsePage(first(searchParams.page)),
  };
}

/** Ссылка на каталог организаций; `page = 1` и пустой `q` в URL не пишутся. */
export function buildOrganizationsHref({ q, page }: OrganizationsParams): string {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${BASE_PATH}?${query}` : BASE_PATH;
}
