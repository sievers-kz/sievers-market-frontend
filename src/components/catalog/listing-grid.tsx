import type { components } from "@/lib/api/schema";
import { cn } from "@/lib/utils";

import { ListingCard } from "./listing-card";
import type { CatalogView } from "./search-params";

type ListingCardResponse = components["schemas"]["ListingCardResponse"];

interface ListingGridProps {
  listings: ListingCardResponse[];
  view: CatalogView;
}

export function ListingGrid({ listings, view }: ListingGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-4",
        view === "grid" && "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {listings.map((listing) => (
        <li key={listing.id} className="flex">
          <ListingCard listing={listing} view={view} />
        </li>
      ))}
    </ul>
  );
}
