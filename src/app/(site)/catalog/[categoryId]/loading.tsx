import { ListingGridSkeleton } from "@/components/catalog/listing-grid-skeleton";
import { SubcategoryNavSkeleton } from "@/components/catalog/subcategory-nav-skeleton";
import { CatalogListHeader } from "@/components/catalog/catalog-list-header";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <main className="flex-1 py-8" aria-busy="true">
      <Container className="flex flex-col gap-6">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-8 w-48 lg:h-9" />

        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[304px_minmax(0,1fr)]">
          <SubcategoryNavSkeleton />

          <div className="flex min-w-0 flex-col gap-4">
            <CatalogListHeader title={<Skeleton className="h-5 w-48" />} />
            <ListingGridSkeleton view="grid" />
          </div>
        </div>
      </Container>
    </main>
  );
}
