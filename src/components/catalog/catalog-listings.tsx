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
  type CatalogScope,
} from "./search-params";
import { ViewToggle } from "./view-toggle";

/** 12 делится на 3 колонки плитки. */
const PAGE_SIZE = 12;

interface CatalogListingsProps {
  scope: CatalogScope;
  /** Уже очищенные параметры (`sanitizeCatalogParams`): иначе поиск ответит 422. */
  params: CatalogParams;
  /** Выбранные фильтры: чипы под шапкой списка. */
  chips: readonly FilterChip[];
}

/**
 * Каталог без фильтров и сортировки берёт список из базы (`getListingsCatalog`), с ними поиск
 * (`searchListing`, `category_id` всегда). Поиск по тексту всегда `searchListing` по всему
 * каталогу (без `category_id`). 422 поиска показываем пустым списком, а не ошибкой:
 * при правильном разборе URL его быть не должно.
 */
async function loadListings(scope: CatalogScope, params: CatalogParams) {
  if (scope.kind === "category" && !needsCatalogSearch(params)) {
    return getListingsCatalog({
      category_id: scope.categoryId,
      subcategory_id: params.subcategoryId,
      page: params.page,
      limit: PAGE_SIZE,
    });
  }

  try {
    return await searchListing({
      text: scope.kind === "search" ? scope.text : null,
      category_id: scope.kind === "category" ? scope.categoryId : null,
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
      console.error(`${scope.kind === "search" ? "Поиск" : "Каталог"}: поиск ответил 422`, error);
      return null;
    }
    throw error;
  }
}

/**
 * Список объявлений. Грузится внутри `Suspense` с `key` по параметрам (см. страницу каталога):
 * при смене фильтра показывается скелетон, сайдбар остаётся на месте.
 */
export async function CatalogListings({ scope, params, chips }: CatalogListingsProps) {
  const listings = await loadListings(scope, params);

  if (listings && params.page > Math.max(listings.pages, 1)) notFound();

  const resetHref = buildCatalogHref(scope, resetCatalogFilters(params));
  const filtered = hasCatalogFilters(params) || (listings === null && scope.kind === "category");

  return (
    <>
      <CatalogListHeader
        title={<p>{formatFound(listings?.total ?? 0)}</p>}
        actions={
          <>
            <CatalogSortSelect scope={scope} params={params} />
            <ViewToggle scope={scope} params={params} />
          </>
        }
      />

      <CatalogFilterChips scope={scope} params={params} chips={chips} />

      {listings && listings.items.length > 0 ? (
        <ListingGrid listings={listings.items} view={params.view} />
      ) : (
        <CatalogEmpty
          resetHref={filtered ? resetHref : undefined}
          query={scope.kind === "search" ? scope.text : undefined}
        />
      )}

      {listings && <CatalogPagination scope={scope} params={params} pages={listings.pages} />}
    </>
  );
}
