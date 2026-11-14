import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CatalogBreadcrumbs } from "@/components/catalog/catalog-breadcrumbs";
import { CatalogListings } from "@/components/catalog/catalog-listings";
import { CatalogListingsSkeleton } from "@/components/catalog/catalog-listings-skeleton";
import { buildCatalogHref, parseCatalogParams } from "@/components/catalog/search-params";
import { SubcategoryNav } from "@/components/catalog/subcategory-nav";
import { Container } from "@/components/layout/container";
import { findCategory, getCategoryTree } from "@/lib/api";

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

  return (
    <main className="flex-1 py-8">
      <Container className="flex flex-col gap-6">
        <CatalogBreadcrumbs
          rubricName={rubric.name}
          categoryName={category.name}
        />
        <h1 className="text-2xl font-semibold lg:text-3xl">{category.name}</h1>

        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[304px_minmax(0,1fr)]">
          <SubcategoryNav
            categoryId={category.id}
            subcategories={category.subcategories}
            params={catalogParams}
          />

          <section aria-label="Объявления" className="flex min-w-0 flex-col gap-4">
            {/* loading.tsx на смену searchParams не срабатывает: граница loading
                привязана к сегменту [categoryId], а не к параметрам. Новый key
                монтирует новую границу, и она показывает скелетон. */}
            <Suspense
              key={buildCatalogHref(category.id, catalogParams)}
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
