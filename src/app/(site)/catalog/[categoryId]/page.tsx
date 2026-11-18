import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CatalogBreadcrumbs } from "@/components/catalog/catalog-breadcrumbs";
import { getFilterChips, sanitizeCatalogParams } from "@/components/catalog/catalog-filter-fields";
import { CatalogFilterChips } from "@/components/catalog/catalog-filter-chips";
import { CatalogFilterPanel } from "@/components/catalog/catalog-filter-panel";
import { CatalogFiltersDialog } from "@/components/catalog/catalog-filters-dialog";
import { CatalogListings } from "@/components/catalog/catalog-listings";
import { CatalogListingsSkeleton } from "@/components/catalog/catalog-listings-skeleton";
import { buildCatalogHref, parseCatalogParams } from "@/components/catalog/search-params";
import { loadCatalogFilters } from "@/components/catalog/load-catalog-filters";
import { SubcategoryNav } from "@/components/catalog/subcategory-nav";
import { Container } from "@/components/layout/container";
import { findCategory, getCategoryTree } from "@/lib/api";

export async function generateMetadata({
  params,
}: PageProps<"/catalog/[categoryId]">): Promise<Metadata> {
  const { categoryId } = await params;
  const found = findCategory(await getCategoryTree(), categoryId);
  return {
    title: found?.category.name ?? "Каталог",
    // Страницы фильтров и пагинации (`?page=`, `?sort=`) считаем копиями основной.
    alternates: { canonical: `/catalog/${categoryId}` },
  };
}

export default async function CatalogPage({
  params,
  searchParams,
}: PageProps<"/catalog/[categoryId]">) {
  const { categoryId } = await params;
  const rawParams = parseCatalogParams(await searchParams);

  // Бэкенд на несуществующую категорию отвечает пустым списком, поэтому проверяем по дереву.
  const found = findCategory(await getCategoryTree(), categoryId);
  if (!found) notFound();
  const { rubric, category } = found;

  if (
    rawParams.subcategoryId &&
    !category.subcategories.some((s) => s.id === rawParams.subcategoryId)
  ) {
    notFound();
  }

  // Города и атрибуты подкатегории: по ним отсекаем лишнее из URL (иначе поиск ответит 422).
  const filterData = await loadCatalogFilters(rawParams.subcategoryId);
  const catalogParams = sanitizeCatalogParams(rawParams, filterData);
  const catalogHref = buildCatalogHref(category.id, catalogParams);
  const chips = getFilterChips(catalogParams, filterData);
  const formProps = {
    categoryId: category.id,
    params: catalogParams,
    cities: filterData.cities,
    fields: filterData.fields,
  };

  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <CatalogBreadcrumbs
          rubricName={rubric.name}
          categoryName={category.name}
        />
        <h1 className="text-2xl font-semibold lg:text-3xl">{category.name}</h1>

        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[304px_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-4">
            <SubcategoryNav
              categoryId={category.id}
              subcategories={category.subcategories}
              params={catalogParams}
            />
            {/* key: форма заново берёт значения из URL после чипов, «назад» и т. п. */}
            <CatalogFilterPanel key={catalogHref} {...formProps} />
          </div>

          <section aria-label="Объявления" className="flex min-w-0 flex-col gap-4">
            {/* Без key: форма в диалоге монтируется заново при каждом открытии. И key
                не должен совпадать с key у Suspense рядом (дубли ключей у соседей). */}
            <CatalogFiltersDialog count={chips.length} {...formProps} />
            <CatalogFilterChips categoryId={category.id} params={catalogParams} chips={chips} />

            {/* loading.tsx на смену searchParams не срабатывает: граница loading
                привязана к сегменту [categoryId], а не к параметрам. Новый key
                монтирует новую границу, и она показывает скелетон. */}
            <Suspense
              key={catalogHref}
              fallback={<CatalogListingsSkeleton categoryId={category.id} params={catalogParams} />}
            >
              <CatalogListings categoryId={category.id} params={catalogParams} />
            </Suspense>
          </section>
        </div>
      </Container>
    </main>
  );
}
