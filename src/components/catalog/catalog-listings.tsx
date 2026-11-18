import { notFound } from "next/navigation";

import { getListingsCatalog, isApiError, searchListing } from "@/lib/api";

import { CatalogEmpty } from "./catalog-empty";
import { toSearchAttributes, toSearchRanges, type FilterChip } from "./catalog-filter-fields";
import { CatalogFilterChips } from "./catalog-filter-chips";
import { CatalogListHeader } from "./catalog-list-header";
import { CatalogPagination } from "./catalog-pagination";
import { CatalogSortSelect } from "./catalog-sort-select";
import { formatFound } from "./format-found";
import { ListingGrid } from "./listing-grid";
import {
  buildCatalogHref,
  hasCatalogFilters,
  needsCatalogSearch,
  resetCatalogFilters,
  type CatalogParams,
} from "./search-params";
import { ViewToggle } from "./view-toggle";

/** 12 делится на 3 колонки плитки. */
const PAGE_SIZE = 12;

interface CatalogListingsProps {
  categoryId: string;
  /** Уже очищенные параметры (`sanitizeCatalogParams`): иначе поиск ответит 422. */
  params: CatalogParams;
  /** Выбранные фильтры: чипы под шапкой списка. */
  chips: readonly FilterChip[];
}

/**
 * Без фильтров и сортировки список из базы (`getListingsCatalog`), с ними поиск
 * (`searchListing`, `category_id` всегда). 422 поиска показываем пустым списком
 * с фильтрами, а не ошибкой: при правильном разборе URL его быть не должно.
 */
async function loadListings(categoryId: string, params: CatalogParams) {
  if (!needsCatalogSearch(params)) {
    return getListingsCatalog({
      category_id: categoryId,
      subcategory_id: params.subcategoryId,
      page: params.page,
      limit: PAGE_SIZE,
    });
  }

  try {
    return await searchListing({
      category_id: categoryId,
      subcategory_id: params.subcategoryId ?? null,
      city_id: params.cityId ?? null,
      price_min: params.priceMin ?? null,
      price_max: params.priceMax ?? null,
      attributes: toSearchAttributes(params.attributes),
      attribute_ranges: toSearchRanges(params.ranges),
      sort: params.sort ?? null,
      page: params.page,
      limit: PAGE_SIZE,
    });
  } catch (error) {
    if (isApiError(error) && error.status === 422) {
      console.error("Каталог: поиск ответил 422", error);
      return null;
    }
    throw error;
  }
}

/**
 * Список объявлений. Грузится внутри `Suspense` с `key` по параметрам (см. страницу каталога):
 * при смене фильтра показывается скелетон, сайдбар остаётся на месте.
 */
export async function CatalogListings({ categoryId, params, chips }: CatalogListingsProps) {
  const listings = await loadListings(categoryId, params);

  if (listings && params.page > Math.max(listings.pages, 1)) notFound();

  const resetHref = buildCatalogHref(categoryId, resetCatalogFilters(params));
  const filtered = listings === null || hasCatalogFilters(params);

  return (
    <>
      <CatalogListHeader
        title={<p>{formatFound(listings?.total ?? 0)}</p>}
        actions={
          <>
            <CatalogSortSelect categoryId={categoryId} params={params} />
            <ViewToggle categoryId={categoryId} params={params} />
          </>
        }
      />

      <CatalogFilterChips categoryId={categoryId} params={params} chips={chips} />

      {listings && listings.items.length > 0 ? (
        <ListingGrid listings={listings.items} view={params.view} />
      ) : (
        <CatalogEmpty resetHref={filtered ? resetHref : undefined} />
      )}

      {listings && <CatalogPagination categoryId={categoryId} params={params} pages={listings.pages} />}
    </>
  );
}
