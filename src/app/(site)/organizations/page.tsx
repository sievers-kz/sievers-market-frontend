import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Pagination } from "@/components/common/pagination";
import { Container } from "@/components/layout/container";
import { formatOrganizationsFound } from "@/components/organizations/format-organizations";
import { OrganizationsEmpty } from "@/components/organizations/organizations-empty";
import { OrganizationsGrid } from "@/components/organizations/organizations-grid";
import { OrganizationsSearchForm } from "@/components/organizations/organizations-search-form";
import {
  buildOrganizationsHref,
  ORGANIZATIONS_PAGE_SIZE,
  parseOrganizationsParams,
} from "@/components/organizations/search-params";
import { getOrganizationsCatalog } from "@/lib/api";

export async function generateMetadata({
  searchParams,
}: PageProps<"/organizations">): Promise<Metadata> {
  const { q } = parseOrganizationsParams(await searchParams);
  return {
    title: "Организации",
    description:
      "Каталог организаций, проверенных по государственному реестру: продавцы сельхозтехники и оборудования.",
    alternates: { canonical: "/organizations" },
    // Выдача поиска это подмножество каталога, в индекс её не пускаем.
    ...(q ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Публичный каталог организаций (`docs/pages/organizations-catalog.md`). Всё состояние в URL. */
export default async function OrganizationsPage({ searchParams }: PageProps<"/organizations">) {
  const params = parseOrganizationsParams(await searchParams);
  const catalog = await getOrganizationsCatalog({
    q: params.q,
    page: params.page,
    limit: ORGANIZATIONS_PAGE_SIZE,
  });

  // При пустом каталоге любая страница показывает пустое состояние, а не 404.
  if (catalog.total > 0 && params.page > catalog.pages) notFound();

  const isEmpty = catalog.items.length === 0;

  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold lg:text-3xl">Организации</h1>
          {!isEmpty && (
            <p className="text-sm text-muted-foreground">
              {formatOrganizationsFound(catalog.total)}
            </p>
          )}
        </div>

        <OrganizationsSearchForm key={params.q ?? ""} initialQuery={params.q ?? ""} />

        {isEmpty ? (
          <OrganizationsEmpty query={params.q} />
        ) : (
          <section aria-label="Список организаций" className="flex flex-col gap-8">
            <OrganizationsGrid items={catalog.items} />
            <Pagination
              current={params.page}
              pages={catalog.pages}
              hrefFor={(page) => buildOrganizationsHref({ ...params, page })}
            />
          </section>
        )}
      </Container>
    </main>
  );
}
