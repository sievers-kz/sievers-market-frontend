import { Skeleton } from "@/components/ui/skeleton";

import type { FilterChip } from "./catalog-filter-fields";
import { CatalogFilterChips } from "./catalog-filter-chips";
import { CatalogListHeader } from "./catalog-list-header";
import { CatalogSortSelect } from "./catalog-sort-select";
import { ListingGridSkeleton } from "./listing-grid-skeleton";
import type { CatalogParams, CatalogScope } from "./search-params";
import { ViewToggle } from "./view-toggle";

interface CatalogListingsSkeletonProps {
  scope: CatalogScope;
  params: CatalogParams;
  chips: readonly FilterChip[];
}

/** Заглушка `CatalogListings`: та же шапка списка и сетка в выбранном виде. */
export function CatalogListingsSkeleton({ scope, params, chips }: CatalogListingsSkeletonProps) {
  return (
    <>
      <CatalogListHeader
        title={<Skeleton className="h-5 w-48" />}
        actions={
          <>
            <CatalogSortSelect scope={scope} params={params} />
            <ViewToggle scope={scope} params={params} />
          </>
        }
      />
      <CatalogFilterChips scope={scope} params={params} chips={chips} />
      <ListingGridSkeleton view={params.view} />
    </>
  );
}
