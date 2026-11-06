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
        "group flex w-full min-w-0 overflow-hidden rounded-2xl bg-card text-card-foreground transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isList ? "flex-col sm:flex-row" : "flex-col",
      )}
    >
      {/* Плитка: 16/9. Список (с sm): фиксированная ширина, высота — по карточке. */}
      <div
        className={cn(
          "relative aspect-video shrink-0 bg-muted",
          isList && "sm:aspect-auto sm:min-h-40 sm:w-64 sm:self-stretch",
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

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <h3
          className="truncate font-medium group-hover:text-primary"
          title={listing.title}
        >
          {listing.title}
        </h3>
        <p
          className="truncate text-sm text-muted-foreground"
          title={listing.display_owner_name}
        >
          {listing.display_owner_name}
        </p>
        <p className="mt-auto pt-2 text-lg font-semibold">
          {formatPrice(listing.price, listing.currency)}
        </p>
        <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{listing.city}</span>
        </p>
      </div>
    </Link>
  );
}
