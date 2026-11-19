import { ListingCardView } from "@/components/catalog/listing-card-view";
import { cn } from "@/lib/utils";

import type { ListingPreviewData } from "./listing-preview-data";

interface ListingPreviewProps {
  data: ListingPreviewData;
  /** Название выбранного города (`data.cityId` → список городов во Flow). */
  cityName: string | null;
  /** Название магазина или юридическое выбранной организации; пока не выбрана — «Организация». */
  organizationName: string;
  /** Название выбранной подкатегории; `null`, пока не выбрана. */
  subcategoryName: string | null;
  className?: string;
}

/**
 * Карточка объявления, какой её увидят в каталоге (та же `ListingCardView`). Не ссылка и не
 * фокусируется. Заглушки только у названия, цены и фото; пустые остальные поля не рисуются.
 */
export function ListingPreview({
  data,
  cityName,
  organizationName,
  subcategoryName,
  className,
}: ListingPreviewProps) {
  return (
    <aside className={cn("flex flex-col gap-2", className)}>
      <p className="text-sm text-muted-foreground">Так объявление увидят в каталоге</p>
      <div role="group" aria-label="Предпросмотр карточки">
        <ListingCardView
          title={data.title || null}
          price={data.price}
          currency={data.currency}
          city={cityName}
          imageSrc={data.imageUrl}
          localImage
          imagePlaceholder="Фото появится здесь"
          organizationName={organizationName}
          condition={data.condition}
          subcategory={subcategoryName}
          dateLabel="сегодня"
        />
      </div>
    </aside>
  );
}
