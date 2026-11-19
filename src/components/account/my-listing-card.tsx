import type { ReactNode } from "react";

import { ListingCardView } from "@/components/catalog/listing-card-view";
import { getMediaUrl, type MyListingCard as MyListingCardData, type MyListingsStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

import { MY_LISTING_STATUS_LABELS, MY_LISTINGS_TEXT } from "./my-listings-labels";

interface MyListingCardProps {
  /** Объявления со статусом `deleted` отбрасывает список, сюда они не попадают. */
  listing: MyListingCardData & { status: MyListingsStatus };
  /** Меню «⋯»: в углу фото ниже `sm`, в углу текстовой колонки от `sm`, над ссылкой. */
  actions?: ReactNode;
}

/**
 * Карточка «Моих объявлений»: общая `ListingCardView` в виде списка плюс чип статуса на фото
 * и меню действий. Только активное ведёт на страницу объявления (ссылка в названии растянута
 * на карточку): неактивное и архивное страница объявления не отдаёт. Тега состояния нет:
 * в ответе `getMyListings` нет поля `condition`.
 */
export function MyListingCard({ listing, actions }: MyListingCardProps) {
  const { id, title, price, currency, status, subcategory, city } = listing;
  const isActive = status === "active";

  return (
    <article className="flex min-w-0">
      <ListingCardView
        view="list"
        titleAs="h2"
        title={title}
        titlePlaceholder={MY_LISTINGS_TEXT.untitled}
        price={price}
        pricePlaceholder={MY_LISTINGS_TEXT.noPrice}
        currency={currency}
        city={city}
        imageSrc={listing.preview_image ? getMediaUrl(listing.preview_image) : null}
        imageDimmed={!isActive}
        imageBadge={
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-2 py-1 text-xs font-medium">
            <span
              aria-hidden
              className={cn("size-2 rounded-full", isActive ? "bg-primary" : "bg-muted-foreground")}
            />
            {MY_LISTING_STATUS_LABELS[status]}
          </span>
        }
        organizationName={listing.organization_name}
        createdAt={listing.created_at}
        subcategory={subcategory}
        titleHref={isActive ? `/listing/${encodeURIComponent(id)}` : undefined}
        actions={actions}
        className={cn(isActive && "group transition-shadow hover:shadow-md")}
      />
    </article>
  );
}
