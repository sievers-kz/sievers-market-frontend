import { OrganizationsListSkeleton } from "@/components/account/organizations-list-skeleton";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationsLoading() {
  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-64 lg:h-9" />
          <Skeleton className="h-12 w-full sm:w-64" />
        </div>
        <OrganizationsListSkeleton />
      </Container>
    </main>
  );
}
