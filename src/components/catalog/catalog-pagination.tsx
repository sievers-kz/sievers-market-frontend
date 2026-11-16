import { Pagination } from "@/components/common/pagination";

import { buildCatalogHref, type CatalogParams } from "./search-params";

interface CatalogPaginationProps {
  categoryId: string;
  params: CatalogParams;
  pages: number;
}

export function CatalogPagination({ categoryId, params, pages }: CatalogPaginationProps) {
  return (
    <Pagination
      current={params.page}
      pages={pages}
      hrefFor={(page) => buildCatalogHref(categoryId, { ...params, page })}
    />
  );
}
