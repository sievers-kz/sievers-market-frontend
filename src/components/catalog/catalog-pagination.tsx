import { Pagination } from "@/components/common/pagination";

import { buildCatalogHref, type CatalogParams, type CatalogScope } from "./search-params";

interface CatalogPaginationProps {
  scope: CatalogScope;
  params: CatalogParams;
  pages: number;
}

export function CatalogPagination({ scope, params, pages }: CatalogPaginationProps) {
  return (
    <Pagination
      current={params.page}
      pages={pages}
      hrefFor={(page) => buildCatalogHref(scope, { ...params, page })}
    />
  );
}
