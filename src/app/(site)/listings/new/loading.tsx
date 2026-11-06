import { Container } from "@/components/layout/container";
import { ListingCreateSkeleton } from "@/components/listing-create/listing-create-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewListingLoading() {
  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64 bg-card lg:h-10" />
        <ListingCreateSkeleton />
      </Container>
    </main>
  );
}
