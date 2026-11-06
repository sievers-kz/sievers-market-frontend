import { MapPin } from "lucide-react";

import { formatPrice } from "@/components/catalog/format-price";

interface ListingSummaryCardProps {
  subcategory: string;
  city: string;
  price: number;
  currency: string;
}

export function ListingSummaryCard({
  subcategory,
  city,
  price,
  currency,
}: ListingSummaryCardProps) {
  return (
    <section
      aria-label="Цена"
      className="flex flex-col gap-4 rounded-2xl bg-card p-6"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{subcategory}</p>
        <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{city}</span>
        </p>
      </div>
      <p className="text-3xl font-bold">{formatPrice(price, currency)}</p>
    </section>
  );
}
