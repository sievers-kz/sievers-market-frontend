import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getFilterChips, sanitizeCatalogParams } from "@/components/catalog/catalog-filter-fields";
import { CatalogFilterPanel } from "@/components/catalog/catalog-filter-panel";
import { CatalogFiltersDialog } from "@/components/catalog/catalog-filters-dialog";
import { CatalogListings } from "@/components/catalog/catalog-listings";
import { CatalogListingsSkeleton } from "@/components/catalog/catalog-listings-skeleton";
import { loadCatalogFilters } from "@/components/catalog/load-catalog-filters";
import {
  buildCatalogHref,
  parseCatalogParams,
  parseSearchText,
  type CatalogScope,
} from "@/components/catalog/search-params";
import { Container } from "@/components/layout/container";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const text = parseSearchText((await searchParams).q);
  return {
    title: text ? `Поиск: ${text}` : "Поиск",
    // Выдача поиска это копии карточек каталога, в индекс её не пускаем.
    robots: { index: false, follow: true },
  };
}

/**
 * Поиск из шапки по всему каталогу (`searchListing` с `text`, без `category_id`).
 * Фильтры только цена и город: атрибуты бэкенд принимает лишь вместе с `subcategory_id`.
 */
export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = await searchParams;
  const text = parseSearchText(raw.q);
  if (!text) redirect("/");

  const scope: CatalogScope = { kind: "search", text };
  // Подкатегории на странице поиска нет: `subcategory` и `f.*` отбрасываются.
  const rawParams = { ...parseCatalogParams(raw, "search"), subcategoryId: undefined };
  const filterData = await loadCatalogFilters(undefined);
  const listParams = sanitizeCatalogParams(rawParams, filterData);
  const searchHref = buildCatalogHref(scope, listParams);
  const chips = getFilterChips(listParams, filterData);
  const formProps = {
    scope,
    params: listParams,
    cities: filterData.cities,
    fields: null,
  };

  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold wrap-anywhere lg:text-3xl">
          Результаты по запросу «{text}»
        </h1>

        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[304px_minmax(0,1fr)]">
          <div className="hidden min-w-0 flex-col gap-4 lg:flex">
            {/* key: форма заново берёт значения из URL после чипов, «назад» и т. п. */}
            <CatalogFilterPanel key={searchHref} {...formProps} />
          </div>

          <section aria-label="Объявления" className="flex min-w-0 flex-col gap-4">
            {/* Без key: см. страницу каталога (ключ не должен совпадать с соседним Suspense). */}
            <CatalogFiltersDialog count={chips.length} {...formProps} />

            {/* Новый key при смене q, фильтров, сортировки, страницы монтирует новую границу
                со скелетоном: loading.tsx на смену searchParams не срабатывает. */}
            <Suspense
              key={searchHref}
              fallback={<CatalogListingsSkeleton scope={scope} params={listParams} chips={chips} />}
            >
              <CatalogListings scope={scope} params={listParams} chips={chips} />
            </Suspense>
          </section>
        </div>
      </Container>
    </main>
  );
}
