import { ImageOff, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { formatPrice } from "./format-price";
import { formatListingDate, getConditionLabel } from "./listing-card-format";
import { LISTING_TAG_CLASS, ListingConditionTag } from "./listing-condition-tag";
import type { CatalogView } from "./search-params";

export interface ListingCardViewProps {
  /** `null` или пустая строка: приглушённая заглушка `titlePlaceholder` (в каталоге не бывает). */
  title: string | null;
  /** `null`: приглушённая заглушка `pricePlaceholder`. */
  price: number | null;
  /** `null` (бывает в «Моих объявлениях»): число без валюты. */
  currency: string | null;
  /** `null` или пустая строка: города и иконки `MapPin` нет. */
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
  /** Готовая подпись даты вместо `createdAt` (превью: «сегодня»). */
  dateLabel?: string;
  /** Название подкатегории: маркер в строке тегов. `null` или пустая строка: маркера нет. */
  subcategory?: string | null;
  titlePlaceholder?: string;
  pricePlaceholder?: string;
  /** Уровень заголовка: в каталоге `h3` (под заголовками списка), в кабинете `h2`. */
  titleAs?: "h2" | "h3";
  /**
   * Ссылка в названии, растянутая на всю карточку (`after:inset-0`): так поверх карточки можно
   * положить кнопки (`actions`). В каталоге не передаётся, там карточку оборачивает `ListingCard`.
   */
  titleHref?: string;
  /** Поверх фото, в левом верхнем углу (чип статуса в «Моих объявлениях»). */
  imageBadge?: ReactNode;
  /** Приглушить фото (неактивное объявление). */
  imageDimmed?: boolean;
  /** Кнопки поверх карточки над ссылкой: ниже `sm` в углу фото, от `sm` в углу текстовой колонки. */
  actions?: ReactNode;
  className?: string;
}

function Placeholder({ children }: { children: string }) {
  return <span className="font-normal text-muted-foreground">{children}</span>;
}

function formatCardPrice(price: number, currency: string | null): string {
  return currency ? formatPrice(price, currency) : new Intl.NumberFormat("ru-RU").format(price);
}

/**
 * Карточка объявления без данных бэкенда, одна на весь сайт: каталог и поиск (`ListingCard`
 * оборачивает её в ссылку), превью в форме создания, «Мои объявления» (`MyListingCard`).
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
  dateLabel,
  subcategory,
  titlePlaceholder = "Название объявления",
  pricePlaceholder = "Цена",
  titleAs: Title = "h3",
  titleHref,
  imageBadge,
  imageDimmed = false,
  actions,
  className,
}: ListingCardViewProps) {
  const isList = view === "list";
  const conditionLabel = getConditionLabel(condition);
  const formattedDate = dateLabel ?? formatListingDate(createdAt);
  const titleContent = title ? title : <Placeholder>{titlePlaceholder}</Placeholder>;

  return (
    <div
      className={cn(
        "relative flex w-full min-w-0 overflow-hidden rounded-2xl bg-card text-card-foreground",
        isList ? "flex-col sm:flex-row" : "flex-col",
        className,
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
          <div className={cn("absolute inset-0", imageDimmed && "opacity-70")}>
            {imageSrc && localImage ? (
              // Локальное превью из blob:, next/image тут не нужен.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageSrc} alt={title ?? ""} className="size-full object-cover" />
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
              <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageOff className="size-12" aria-hidden />
                {imagePlaceholder && <span className="text-xs">{imagePlaceholder}</span>}
              </div>
            )}
          </div>
          {imageBadge && <div className="absolute top-2 left-2">{imageBadge}</div>}
        </div>
      </div>

      {/* Сверху 8 даёт p-2 у фото, между блоками 8. Футер прижат к низу, чтобы
          линии в ряду карточек совпадали. С `actions` от sm справа место под кнопку 40 + 8. */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-2 px-4 pt-0 pb-4",
          isList && "sm:pt-2",
          actions && "sm:pr-14",
        )}
      >
        {(conditionLabel || subcategory) && (
          <div className="flex min-w-0 gap-2">
            <ListingConditionTag condition={condition} />
            {subcategory && (
              <span
                className={cn(LISTING_TAG_CLASS, "min-w-0 bg-muted text-muted-foreground")}
                title={subcategory}
              >
                <span className="truncate">{subcategory}</span>
              </span>
            )}
          </div>
        )}
        <Title
          className="truncate text-base font-medium group-hover:text-primary"
          title={title || undefined}
        >
          {titleHref ? (
            <Link
              href={titleHref}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {titleContent}
            </Link>
          ) : (
            titleContent
          )}
        </Title>
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
          {price === null ? (
            <Placeholder>{pricePlaceholder}</Placeholder>
          ) : (
            formatCardPrice(price, currency)
          )}
        </p>
        {(city || formattedDate) && (
          <div className="mt-auto border-t border-border pt-2">
            <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
              {city && <MapPin className="size-4 shrink-0" aria-hidden />}
              <span className="truncate">
                {city}
                {city && formattedDate && " · "}
                {formattedDate &&
                  (createdAt && !dateLabel ? (
                    <time dateTime={createdAt}>{formattedDate}</time>
                  ) : (
                    formattedDate
                  ))}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Ниже sm угол фото (p-2 обёртки + 8), от sm угол текстовой колонки (8 от края). */}
      {actions && (
        <div className="absolute top-4 right-4 z-10 sm:top-2 sm:right-2">{actions}</div>
      )}
    </div>
  );
}
