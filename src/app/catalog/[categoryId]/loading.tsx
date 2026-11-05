import { ListingCardSkeleton } from "@/components/catalog/listing-card-skeleton";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <main className="flex-1 bg-muted py-8" aria-busy="true">
      <Container className="flex flex-col gap-6">
        <Skeleton className="h-4 w-64 bg-card" />
        <Skeleton className="h-8 w-48 bg-card" />

        <div className="grid items-start gap-6 lg:grid-cols-[304px_minmax(0,1fr)]">
          <Skeleton className="h-14 rounded-2xl bg-card lg:h-64" />

          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-48 bg-card" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <ListingCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
