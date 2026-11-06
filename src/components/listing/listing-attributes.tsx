import { cn } from "@/lib/utils";

import { getAttributeLabel } from "./attribute-label";

interface ListingAttributesProps {
  attributes: Record<string, unknown>;
  className?: string;
}

function formatValue(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? new Intl.NumberFormat("ru-RU").format(value)
      : null;
  }
  if (typeof value === "boolean") return value ? "Да" : "Нет";
  // null, вложенные объекты и массивы пропускаем.
  return null;
}

export function ListingAttributes({ attributes, className }: ListingAttributesProps) {
  const items = Object.entries(attributes).flatMap(([key, raw]) => {
    const value = formatValue(raw);
    return value === null ? [] : [{ key, label: getAttributeLabel(key), value }];
  });

  if (items.length === 0) return null;

  return (
    <section
      className={cn("flex flex-col gap-4 rounded-2xl bg-card p-6", className)}
    >
      <h2 className="text-xl font-semibold">Характеристики</h2>
      <dl className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex min-w-0 flex-col gap-1 rounded-xl bg-muted p-4"
          >
            <dt className="truncate text-sm text-muted-foreground" title={item.label}>
              {item.label}
            </dt>
            <dd className="font-medium break-words">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
