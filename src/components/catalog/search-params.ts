export type CatalogView = "grid" | "list";

export interface CatalogParams {
  subcategoryId?: string;
  page: number;
  view: CatalogView;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Разбор `?subcategory=&page=&view=`. Некорректные значения заменяются значениями по умолчанию. */
export function parseCatalogParams(searchParams: RawSearchParams): CatalogParams {
  const rawPage = Number(first(searchParams.page));
  return {
    subcategoryId: first(searchParams.subcategory) || undefined,
    page: Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1,
    view: first(searchParams.view) === "list" ? "list" : "grid",
  };
}

/** Ссылка на каталог. Значения по умолчанию (`page=1`, `view=grid`) в URL не пишем. */
export function buildCatalogHref(categoryId: string, params: CatalogParams): string {
  const query = new URLSearchParams();
  if (params.subcategoryId) query.set("subcategory", params.subcategoryId);
  if (params.page > 1) query.set("page", String(params.page));
  if (params.view !== "grid") query.set("view", params.view);
  const search = query.toString();
  return `/catalog/${categoryId}${search ? `?${search}` : ""}`;
}
