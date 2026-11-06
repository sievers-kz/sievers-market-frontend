import { MapPin } from "lucide-react";

import { formatPrice } from "@/components/catalog/format-price";

import { ShowPhoneButton } from "./show-phone-button";

interface ListingSummaryCardProps {
  listingId: string;
  subcategory: string;
  title: string;
  city: string;
  price: number;
  currency: string;
  hasPhone: boolean;
}

export function ListingSummaryCard({
  listingId,
  subcategory,
  title,
  city,
  price,
  currency,
  hasPhone,
}: ListingSummaryCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-card p-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{subcategory}</p>
        <h1 className="text-2xl font-semibold break-words">{title}</h1>
        <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{city}</span>
        </p>
      </div>
      <p className="text-3xl font-bold">{formatPrice(price, currency)}</p>
      {hasPhone && <ShowPhoneButton listingId={listingId} />}
    </section>
  );
}
