import Link from "next/link";

import { getMediaUrl } from "@/lib/api";
import type { components } from "@/lib/api/schema";

import { ListingCardView } from "./listing-card-view";
import type { CatalogView } from "./search-params";

type ListingCardResponse = components["schemas"]["ListingCardResponse"];

interface ListingCardProps {
  listing: ListingCardResponse;
  view: CatalogView;
}

export function ListingCard({ listing, view }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex w-full min-w-0 rounded-2xl transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ListingCardView
        title={listing.title}
        price={listing.price}
        currency={listing.currency}
        city={listing.city}
        imageSrc={listing.preview_image ? getMediaUrl(listing.preview_image) : null}
        view={view}
      />
    </Link>
  );
}
