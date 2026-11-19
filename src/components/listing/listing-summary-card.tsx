import type { ReactNode } from "react";

import { formatPrice } from "@/components/catalog/format-price";

interface ListingSummaryCardProps {
  price: number;
  currency: string;
  /** Под ценой: ключевые характеристики (`ListingKeySpecs`), позже кнопки. */
  children?: ReactNode;
}

/** Карточка объявления в правой колонке: цена крупно, под ней «Цена с НДС». */
export function ListingSummaryCard({ price, currency, children }: ListingSummaryCardProps) {
  return (
    <section aria-label="Цена" className="flex flex-col gap-6 rounded-2xl bg-card p-6">
      <div className="flex flex-col gap-1">
        <p className="text-3xl font-bold">{formatPrice(price, currency)}</p>
        <p className="text-sm text-muted-foreground">Цена с НДС</p>
      </div>
      {children}
    </section>
  );
}
