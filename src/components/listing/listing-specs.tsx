import type { ListingSpecGroup, ListingSpecItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ListingSpecsProps {
  /** Готовые к показу характеристики из `specs`: группы и строки в порядке формы. */
  groups: readonly ListingSpecGroup[];
  className?: string;
}

/**
 * Разряды с 5 цифр (`12 100`, но `2100`): год выпуска приходит обычным числом,
 * и с 4 цифр он стал бы «2 024» (решение владельца, 19 ноября 2026).
 */
const numberFormat = new Intl.NumberFormat("ru-RU", { useGrouping: "min2" });

/** «значение единица»: подписи вариантов и справочников бэкенд уже прислал, числа форматируем. */
export function formatSpecValue({ value, unit }: Pick<ListingSpecItem, "value" | "unit">): string {
  const text = typeof value === "number" ? numberFormat.format(value) : value;
  return unit ? `${text} ${unit}` : text;
}

export function ListingSpecs({ groups, className }: ListingSpecsProps) {
  const visible = groups.filter((group) => group.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <section
      aria-labelledby="listing-specs-title"
      className={cn("flex flex-col gap-6 rounded-2xl bg-card p-6", className)}
    >
      <h2 id="listing-specs-title" className="text-xl font-semibold">
        Характеристики
      </h2>
      {visible.map((group) => (
        <div key={group.key} className="flex flex-col gap-2">
          <h3 className="font-semibold">{group.label}</h3>
          <dl className="flex flex-col">
            {group.items.map((item) => (
              <div
                key={item.key}
                className="grid grid-cols-2 gap-4 border-b border-border py-2 last:border-b-0"
              >
                <dt className="min-w-0 break-words text-muted-foreground">{item.label}</dt>
                <dd className="min-w-0 font-medium break-words">{formatSpecValue(item)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  );
}
