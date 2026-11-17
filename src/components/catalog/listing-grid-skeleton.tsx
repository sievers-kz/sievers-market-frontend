import { cn } from "@/lib/utils";

import { ListingCardSkeleton } from "./listing-card-skeleton";
import type { CatalogView } from "./search-params";

const COUNT = 6;

/** Та же сетка, что у `ListingGrid`, только из карточек-заглушек. */
export function ListingGridSkeleton({ view }: { view: CatalogView }) {
  return (
    <ul
      aria-hidden
      className={cn("grid grid-cols-1 gap-4", view === "grid" && "sm:grid-cols-2 lg:grid-cols-3")}
    >
      {Array.from({ length: COUNT }, (_, index) => (
        <li key={index} className="flex">
          <ListingCardSkeleton view={view} />
        </li>
      ))}
    </ul>
  );
}
