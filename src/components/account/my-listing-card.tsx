import { ImageOff, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { formatPrice } from "@/components/catalog/format-price";
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
 * В OpenAPI `currency` может быть `null` (в спеке нет): тогда число без валюты.
 */
function formatCardPrice(price: number, currency: string | null): string {
  return currency ? formatPrice(price, currency) : new Intl.NumberFormat("ru-RU").format(price);
}

/**
 * Карточка «Моих объявлений»: от `sm` горизонтальная (фото 240×160 слева), ниже вертикальная
 * (фото 16/9 сверху). Только активное ведёт на страницу объявления: ссылка в названии растянута
 * на карточку (`after:inset-0`), чтобы потом рядом можно было положить кнопки действий.
 * Неактивное и архивное без ссылки и без ховера: страница объявления их не отдаёт.
 * Меню действий лежит над растянутой ссылкой (`z-10`), а не внутри `<a>`.
 */
export function MyListingCard({ listing, actions }: MyListingCardProps) {
  const { id, title, price, currency, status, subcategory, city } = listing;
  const isActive = status === "active";
  const organizationName = listing.organization_name || MY_LISTINGS_TEXT.organizationFallback;

  return (
    <article
      className={cn(
        "relative flex min-w-0 flex-col gap-4 rounded-2xl bg-card p-4 text-card-foreground sm:flex-row",
        isActive && "transition-shadow hover:shadow-md",
      )}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:aspect-auto sm:h-40 sm:w-60">
        <div className={cn("absolute inset-0", !isActive && "opacity-70")}>
          {listing.preview_image ? (
            <Image
              src={getMediaUrl(listing.preview_image)}
              alt={title ?? ""}
              fill
              sizes="(min-width: 640px) 240px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-12" aria-hidden />
            </div>
          )}
        </div>
        <span className="absolute top-2 left-2 inline-flex items-center gap-2 rounded-full bg-card px-2 py-1 text-xs font-medium">
          <span
            aria-hidden
            className={cn("size-2 rounded-full", isActive ? "bg-primary" : "bg-muted-foreground")}
          />
          {MY_LISTING_STATUS_LABELS[status]}
        </span>
      </div>

      {/* Под кнопку 40 + зазор 8 справа от названия (от `sm` кнопка в этой колонке). */}
      <div className={cn("flex min-w-0 flex-1 flex-col gap-2", actions && "sm:pr-12")}>
        <h2 className="line-clamp-2 text-base font-semibold break-words">
          {isActive ? (
            <Link
              href={`/listing/${encodeURIComponent(id)}`}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {title || <span className="font-normal text-muted-foreground">{MY_LISTINGS_TEXT.untitled}</span>}
            </Link>
          ) : (
            title || <span className="font-normal text-muted-foreground">{MY_LISTINGS_TEXT.untitled}</span>
          )}
        </h2>
        <p className="truncate text-sm text-muted-foreground">{subcategory}</p>
        <p className="truncate text-sm text-muted-foreground">{organizationName}</p>
        <p className="text-lg font-semibold">
          {price === null ? (
            <span className="font-normal text-muted-foreground">{MY_LISTINGS_TEXT.noPrice}</span>
          ) : (
            formatCardPrice(price, currency)
          )}
        </p>
        {city && (
          <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{city}</span>
          </p>
        )}
      </div>

      {/* Ниже `sm` угол фото (p-4 карточки + отступ 8), от `sm` угол текстовой колонки. */}
      {actions && (
        <div className="absolute top-6 right-6 z-10 sm:top-4 sm:right-4">{actions}</div>
      )}
    </article>
  );
}
