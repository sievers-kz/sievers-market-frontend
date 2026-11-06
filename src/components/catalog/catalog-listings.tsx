import { notFound } from "next/navigation";

import { getListingsCatalog } from "@/lib/api";

import { CatalogEmpty } from "./catalog-empty";
import { CatalogListHeader } from "./catalog-list-header";
import { CatalogPagination } from "./catalog-pagination";
import { formatFound } from "./format-found";
import { ListingGrid } from "./listing-grid";
import type { CatalogParams } from "./search-params";
import { ViewToggle } from "./view-toggle";

/** 12 делится на 3 колонки плитки. */
const PAGE_SIZE = 12;

interface CatalogListingsProps {
  categoryId: string;
  params: CatalogParams;
}

/**
 * Список объявлений. Грузится внутри `Suspense` с `key` по параметрам (см. страницу каталога):
 * при смене фильтра показывается скелетон, сайдбар остаётся на месте.
 */
export async function CatalogListings({ categoryId, params }: CatalogListingsProps) {
  const listings = await getListingsCatalog({
    category_id: categoryId,
    subcategory_id: params.subcategoryId,
    page: params.page,
    limit: PAGE_SIZE,
  });

  if (params.page > Math.max(listings.pages, 1)) notFound();

  return (
    <>
      <CatalogListHeader
        title={<p>{formatFound(listings.total)}</p>}
        actions={<ViewToggle categoryId={categoryId} params={params} />}
      />

      {listings.items.length > 0 ? (
        <ListingGrid listings={listings.items} view={params.view} />
      ) : (
        <CatalogEmpty />
      )}

      <CatalogPagination categoryId={categoryId} params={params} pages={listings.pages} />
    </>
  );
}
