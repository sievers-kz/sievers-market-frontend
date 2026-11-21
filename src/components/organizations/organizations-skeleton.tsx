import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

import { OrganizationCardSkeleton } from "./organization-card-skeleton";
import { ORGANIZATIONS_GRID_CLASS } from "./organizations-grid";
import { ORGANIZATIONS_PAGE_SIZE } from "./search-params";

/** Скелетон страницы каталога: заголовок, поиск и полная страница карточек-заглушек. */
export function OrganizationsSkeleton() {
  return (
    <main className="flex-1 bg-muted py-8" aria-busy="true">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48 lg:h-9" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-24" />
        </div>
        <ul aria-hidden className={ORGANIZATIONS_GRID_CLASS}>
          {Array.from({ length: ORGANIZATIONS_PAGE_SIZE }, (_, index) => (
            <li key={index} className="flex min-w-0">
              <OrganizationCardSkeleton />
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
