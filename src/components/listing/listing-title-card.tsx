import { CalendarDays, MapPin } from "lucide-react";

import { formatListingDate } from "@/components/catalog/listing-card-format";
import { LISTING_TAG_CLASS, ListingConditionTag } from "@/components/catalog/listing-condition-tag";
import { cn } from "@/lib/utils";

interface ListingTitleCardProps {
  subcategory: string;
  title: string;
  city: string;
  /** Ключ состояния (`new`, `used`); `null`: тега нет. */
  condition: string | null;
  createdAt: string;
}

export function ListingTitleCard({
  subcategory,
  title,
  city,
  condition,
  createdAt,
}: ListingTitleCardProps) {
  const date = formatListingDate(createdAt);

  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-card p-6">
      <div className="flex min-w-0 items-center gap-2">
        <ListingConditionTag condition={condition} />
        {/* Бейдж подкатегории: нейтральный, как «Б/У» и маркер в карточке каталога. */}
        <span
          className={cn(LISTING_TAG_CLASS, "min-w-0 bg-muted text-muted-foreground")}
          title={subcategory}
        >
          <span className="truncate">{subcategory}</span>
        </span>
      </div>
      <h1 className="text-2xl font-semibold break-words lg:text-3xl">{title}</h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <p className="flex min-w-0 items-center gap-1">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{city}</span>
        </p>
        {date && (
          <p className="flex items-center gap-1">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            <span>
              Опубликовано <time dateTime={createdAt}>{date}</time>
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
