import { Skeleton } from "@/components/ui/skeleton";

import { CatalogListHeader } from "./catalog-list-header";
import { ListingGridSkeleton } from "./listing-grid-skeleton";
import type { CatalogParams } from "./search-params";
import { ViewToggle } from "./view-toggle";

interface CatalogListingsSkeletonProps {
  categoryId: string;
  params: CatalogParams;
}

/** Заглушка `CatalogListings`: та же шапка списка и сетка в выбранном виде. */
export function CatalogListingsSkeleton({ categoryId, params }: CatalogListingsSkeletonProps) {
  return (
    <>
      <CatalogListHeader
        title={<Skeleton className="h-5 w-48" />}
        actions={<ViewToggle categoryId={categoryId} params={params} />}
      />
      <ListingGridSkeleton view={params.view} />
    </>
  );
}
