import { formatPrice } from "@/components/catalog/format-price";

interface ListingSummaryCardProps {
  price: number;
  currency: string;
}

/** Только цена: валюту уже подписывает `formatPrice` (символ или код). */
export function ListingSummaryCard({ price, currency }: ListingSummaryCardProps) {
  return (
    <section aria-label="Цена" className="rounded-2xl bg-card p-6">
      <p className="text-3xl font-bold">{formatPrice(price, currency)}</p>
    </section>
  );
}
