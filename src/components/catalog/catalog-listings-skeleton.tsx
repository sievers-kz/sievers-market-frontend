import { Skeleton } from "@/components/ui/skeleton";

import type { FilterChip } from "./catalog-filter-fields";
import { CatalogFilterChips } from "./catalog-filter-chips";
import { CatalogListHeader } from "./catalog-list-header";
import { CatalogSortSelect } from "./catalog-sort-select";
import { ListingGridSkeleton } from "./listing-grid-skeleton";
import type { CatalogParams } from "./search-params";
import { ViewToggle } from "./view-toggle";

interface CatalogListingsSkeletonProps {
  categoryId: string;
  params: CatalogParams;
  chips: readonly FilterChip[];
}

/** Заглушка `CatalogListings`: та же шапка списка и сетка в выбранном виде. */
export function CatalogListingsSkeleton({ categoryId, params, chips }: CatalogListingsSkeletonProps) {
  return (
    <>
      <CatalogListHeader
        title={<Skeleton className="h-5 w-48" />}
        actions={
          <>
            <CatalogSortSelect categoryId={categoryId} params={params} />
            <ViewToggle categoryId={categoryId} params={params} />
          </>
        }
      />
      <CatalogFilterChips categoryId={categoryId} params={params} chips={chips} />
      <ListingGridSkeleton view={params.view} />
    </>
  );
}
