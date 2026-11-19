import { cn } from "@/lib/utils";

import { getConditionLabel } from "./listing-card-format";

/** Общий вид тегов карточки (состояние, подкатегория): высота 24. */
export const LISTING_TAG_CLASS = "inline-flex rounded-md px-2 py-1 text-xs font-medium";

interface ListingConditionTagProps {
  /** Ключ состояния (`new`, `used`). Любое другое значение: ничего не рисуется. */
  condition: string | null | undefined;
  className?: string;
}

/** Тег «Новый» / «Б/У»: карточка объявления и страница объявления. */
export function ListingConditionTag({ condition, className }: ListingConditionTagProps) {
  const label = getConditionLabel(condition);
  if (!label) return null;

  return (
    <span
      className={cn(
        LISTING_TAG_CLASS,
        "shrink-0",
        condition === "new" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
