import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogBreadcrumbs } from "@/components/catalog/catalog-breadcrumbs";
import { CatalogEmpty } from "@/components/catalog/catalog-empty";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { ListingGrid } from "@/components/catalog/listing-grid";
import { parseCatalogParams } from "@/components/catalog/search-params";
import { SubcategoryNav } from "@/components/catalog/subcategory-nav";
import { ViewToggle } from "@/components/catalog/view-toggle";
import { Container } from "@/components/layout/container";
import { findCategory, getCategoryTree, getListingsCatalog } from "@/lib/api";

/** 12 делится на 3 колонки плитки. */
const PAGE_SIZE = 12;

export async function generateMetadata({
  params,
}: PageProps<"/catalog/[categoryId]">): Promise<Metadata> {
  const { categoryId } = await params;
  const found = findCategory(await getCategoryTree(), categoryId);
  return { title: found?.category.name ?? "Каталог" };
}

export default async function CatalogPage({
  params,
  searchParams,
}: PageProps<"/catalog/[categoryId]">) {
  const { categoryId } = await params;
  const catalogParams = parseCatalogParams(await searchParams);

  // Бэкенд на несуществующую категорию отвечает пустым списком, поэтому проверяем по дереву.
  const found = findCategory(await getCategoryTree(), categoryId);
  if (!found) notFound();
  const { rubric, category } = found;

  if (
    catalogParams.subcategoryId &&
    !category.subcategories.some((s) => s.id === catalogParams.subcategoryId)
  ) {
    notFound();
  }

  const listings = await getListingsCatalog({
    category_id: category.id,
    subcategory_id: catalogParams.subcategoryId,
    page: catalogParams.page,
    limit: PAGE_SIZE,
  });

  if (catalogParams.page > Math.max(listings.pages, 1)) notFound();

  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <CatalogBreadcrumbs
          rubricName={rubric.name}
          categoryName={category.name}
        />
        <h1 className="text-2xl font-semibold lg:text-3xl">{category.name}</h1>

        <div className="grid items-start gap-4 lg:grid-cols-[304px_minmax(0,1fr)]">
          <SubcategoryNav
            categoryId={category.id}
            subcategories={category.subcategories}
            params={catalogParams}
          />

          <section aria-label="Объявления" className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Найдено объявлений: {listings.total}
              </p>
              <ViewToggle categoryId={category.id} params={catalogParams} />
            </div>

            {listings.items.length > 0 ? (
              <ListingGrid listings={listings.items} view={catalogParams.view} />
            ) : (
              <CatalogEmpty />
            )}

            <CatalogPagination
              categoryId={category.id}
              params={catalogParams}
              pages={listings.pages}
            />
          </section>
        </div>
      </Container>
    </main>
  );
}
