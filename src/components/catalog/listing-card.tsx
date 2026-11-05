import { ImageOff, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getMediaUrl } from "@/lib/api";
import type { components } from "@/lib/api/schema";
import { cn } from "@/lib/utils";

import { formatPrice } from "./format-price";
import type { CatalogView } from "./search-params";

type ListingCardResponse = components["schemas"]["ListingCardResponse"];

interface ListingCardProps {
  listing: ListingCardResponse;
  view: CatalogView;
}

export function ListingCard({ listing, view }: ListingCardProps) {
  const isList = view === "list";

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        "group flex w-full overflow-hidden rounded-2xl bg-card text-card-foreground transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isList ? "flex-col sm:flex-row" : "flex-col",
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] shrink-0 bg-muted",
          isList && "sm:w-64",
        )}
      >
        {listing.preview_image ? (
          <Image
            src={getMediaUrl(listing.preview_image)}
            alt={listing.title}
            fill
            sizes={
              isList
                ? "(min-width: 640px) 256px, 100vw"
                : "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-medium group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {listing.display_owner_name}
        </p>
        <p className="mt-auto pt-2 text-lg font-semibold">
          {formatPrice(listing.price, listing.currency)}
        </p>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {listing.city}
        </p>
      </div>
    </Link>
  );
}
