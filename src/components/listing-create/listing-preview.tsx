import { ListingCardView } from "@/components/catalog/listing-card-view";
import { cn } from "@/lib/utils";

import type { ListingPreviewData } from "./listing-preview-data";

interface ListingPreviewProps {
  data: ListingPreviewData;
  /** Название выбранного города (`data.cityId` → список городов во Flow). */
  cityName: string | null;
  className?: string;
}

/** Карточка объявления, какой её увидят в каталоге. Не ссылка и не фокусируется. */
export function ListingPreview({ data, cityName, className }: ListingPreviewProps) {
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
        />
      </div>
    </aside>
  );
}
