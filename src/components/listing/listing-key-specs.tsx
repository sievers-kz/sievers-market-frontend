import type { ListingSpecGroup } from "@/lib/api";

import { formatSpecValue, LISTING_SPECS_ID } from "./listing-specs";

/** Группа `specs`, которая показывается в карточке объявления, а не в «Характеристиках». */
const KEY_SPECS_GROUP = "general";

/** Характеристики для блока слева: всё, кроме группы из карточки объявления. */
export function withoutKeySpecs(groups: readonly ListingSpecGroup[]): ListingSpecGroup[] {
  return groups.filter((group) => group.key !== KEY_SPECS_GROUP);
}

interface ListingKeySpecsProps {
  specs: readonly ListingSpecGroup[];
}

/**
 * Строки группы `general` в карточке объявления (под ценой, за разделителем) и ссылка
 * «Все характеристики». Временный блок: когда его уберут, на странице убрать эту строку
 * и `withoutKeySpecs`. Нет группы или она пуста — ничего не рисуется.
 */
export function ListingKeySpecs({ specs }: ListingKeySpecsProps) {
  const group = specs.find((item) => item.key === KEY_SPECS_GROUP);
  if (!group || group.items.length === 0) return null;
  // Ссылка только если слева есть блок, к которому вести.
  const hasMore = withoutKeySpecs(specs).some((item) => item.items.length > 0);

  return (
    <>
      <hr className="border-border" />
      <div className="flex flex-col gap-2">
        <dl className="flex flex-col">
          {group.items.map((item) => (
            <div key={item.key} className="flex justify-between gap-4 py-2 text-sm">
              <dt className="min-w-0 text-muted-foreground">{item.label}</dt>
              <dd className="min-w-0 text-right font-medium break-words">
                {formatSpecValue(item)}
              </dd>
            </div>
          ))}
        </dl>
        {hasMore && (
          <a
            href={`#${LISTING_SPECS_ID}`}
            className="self-start text-sm font-medium text-primary hover:underline"
          >
            Все характеристики
          </a>
        )}
      </div>
    </>
  );
}
