import { ImageOff, MapPin } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { formatPrice } from "./format-price";
import type { CatalogView } from "./search-params";

export interface ListingCardViewProps {
  /** `null` или пустая строка: приглушённая заглушка (в каталоге не бывает). */
  title: string | null;
  price: number | null;
  currency: string;
  city: string | null;
  imageSrc: string | null;
  /** Локальное превью (`blob:`): обычный `img`, `next/image` его не оптимизирует. */
  localImage?: boolean;
  view?: CatalogView;
}

function Placeholder({ children }: { children: string }) {
  return <span className="font-normal text-muted-foreground">{children}</span>;
}

/**
 * Вёрстка карточки объявления без ссылки и без данных бэкенда. В каталоге её оборачивает
 * `ListingCard`, в форме создания она же служит превью.
 */
export function ListingCardView({
  title,
  price,
  currency,
  city,
  imageSrc,
  localImage = false,
  view = "grid",
}: ListingCardViewProps) {
  const isList = view === "list";

  return (
    <div
      className={cn(
        "flex w-full min-w-0 overflow-hidden rounded-2xl bg-card text-card-foreground",
        isList ? "flex-col sm:flex-row" : "flex-col",
      )}
    >
      {/* Плитка: 16/9. Список (с sm): фиксированная ширина, высота — по карточке. */}
      <div
        className={cn(
          "relative aspect-video shrink-0 bg-muted",
          isList && "sm:aspect-auto sm:min-h-40 sm:w-64 sm:self-stretch",
        )}
      >
        {imageSrc && localImage ? (
          // Локальное превью из blob:, next/image тут не нужен.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={title ?? ""} className="absolute inset-0 size-full object-cover" />
        ) : imageSrc ? (
          <Image
            src={imageSrc}
            alt={title ?? ""}
            fill
            sizes={
              isList
                ? "(min-width: 640px) 256px, 100vw"
                : "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <h3 className="truncate font-medium group-hover:text-primary" title={title || undefined}>
          {title ? title : <Placeholder>Название объявления</Placeholder>}
        </h3>
        <p className="mt-auto text-lg font-semibold">
          {price === null ? <Placeholder>Цена</Placeholder> : formatPrice(price, currency)}
        </p>
        <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{city || "Город"}</span>
        </p>
      </div>
    </div>
  );
}
