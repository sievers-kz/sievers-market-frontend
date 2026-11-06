import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListingLoading() {
  return (
    <main className="flex-1 bg-muted py-8" aria-busy="true">
      <Container className="flex flex-col gap-6">
        <Skeleton className="h-4 w-64 bg-card" />
        <Skeleton className="h-8 w-2/3 bg-card" />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <Skeleton className="aspect-[4/3] rounded-2xl bg-card" />

          <div className="flex flex-col gap-4">
            <Skeleton className="h-40 rounded-2xl bg-card" />
            <Skeleton className="h-40 rounded-2xl bg-card" />
          </div>
        </div>
      </Container>
    </main>
  );
}
