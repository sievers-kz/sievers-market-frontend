import { ImageOff, MapPin, Store } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { formatPrice } from "./format-price";
import { formatListingDate, getConditionLabel } from "./listing-card-format";
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
  /** Подпись под иконкой, пока фото нет (превью). В каталоге не передаётся: только иконка. */
  imagePlaceholder?: string;
  /** Организация-продавец. `null` или пустая строка: строка не рисуется. */
  organizationName?: string | null;
  /** Ключ состояния (`new`, `used`). Любое другое значение: тега нет. */
  condition?: string | null;
  /** Дата создания (ISO). Нет или некорректная: рядом с городом ничего. */
  createdAt?: string | null;
  /** Название подкатегории: маркер в строке тегов. `null` или пустая строка: маркера нет. */
  subcategory?: string | null;
}

const TAG_CLASS = "inline-flex rounded-md px-2 py-1 text-xs font-medium";

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
  imagePlaceholder,
  organizationName,
  condition,
  createdAt,
  subcategory,
}: ListingCardViewProps) {
  const isList = view === "list";
  const conditionLabel = getConditionLabel(condition);
  const dateLabel = formatListingDate(createdAt);

  return (
    <div
      className={cn(
        "flex w-full min-w-0 overflow-hidden rounded-2xl bg-card text-card-foreground",
        isList ? "flex-col sm:flex-row" : "flex-col",
      )}
    >
      {/* Фото с отступом 8 от краёв карточки. Плитка: 16/9. Список (с sm): фиксированная
          ширина, высота — по карточке. */}
      <div className={cn("shrink-0 p-2", isList && "sm:flex sm:w-64 sm:self-stretch")}>
        <div
          className={cn(
            "relative aspect-video overflow-hidden rounded-lg bg-muted",
            isList && "sm:aspect-auto sm:min-h-36 sm:flex-1",
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
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="size-12" aria-hidden />
              {imagePlaceholder && <span className="text-xs">{imagePlaceholder}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Вместе с p-2 у фото сверху 16, между блоками 16. Футер прижат к низу, чтобы
          линии в ряду карточек совпадали. */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 pt-2 pb-4">
        {(conditionLabel || subcategory) && (
          <div className="flex min-w-0 gap-2">
            {conditionLabel && (
              <span
                className={cn(
                  TAG_CLASS,
                  "shrink-0",
                  condition === "new"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {conditionLabel}
              </span>
            )}
            {subcategory && (
              <span
                className={cn(TAG_CLASS, "min-w-0 bg-muted text-muted-foreground")}
                title={subcategory}
              >
                <span className="truncate">{subcategory}</span>
              </span>
            )}
          </div>
        )}
        <h3 className="truncate font-medium group-hover:text-primary" title={title || undefined}>
          {title ? title : <Placeholder>Название объявления</Placeholder>}
        </h3>
        {organizationName && (
          <p
            className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground"
            title={organizationName}
          >
            <Store className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{organizationName}</span>
          </p>
        )}
        <p className="text-lg font-semibold">
          {price === null ? <Placeholder>Цена</Placeholder> : formatPrice(price, currency)}
        </p>
        <div className="mt-auto border-t border-border pt-4">
          <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">
              {city || "Город"}
              {dateLabel && createdAt && (
                <>
                  {" · "}
                  <time dateTime={createdAt}>{dateLabel}</time>
                </>
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
