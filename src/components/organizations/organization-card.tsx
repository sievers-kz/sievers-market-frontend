import type { OrganizationCard as OrganizationCardData } from "@/lib/api";
import { cn } from "@/lib/utils";

import { formatListingsCount } from "./format-organizations";
import { OrganizationLogo } from "./organization-logo";

/**
 * Карточка организации в каталоге. Пока не кликабельна: страницы организации нет.
 * `flex flex-col` оставлен, чтобы закрепить внизу (`mt-auto`) кнопку «Подробнее», когда появится деталка.
 */
export function OrganizationCard({ organization }: { organization: OrganizationCardData }) {
  const { name, listings_count: listingsCount } = organization;
  const hasListings = listingsCount > 0;

  return (
    <article className="flex h-full w-full min-w-0 flex-col rounded-2xl bg-card p-4 lg:p-6">
      <OrganizationLogo />
      <h2 title={name} className="mt-4 truncate text-base font-semibold">
        {name}
      </h2>
      <p
        className={cn(
          "mt-2 text-sm",
          hasListings ? "text-primary" : "text-muted-foreground",
        )}
      >
        {hasListings ? formatListingsCount(listingsCount) : "Нет объявлений"}
      </p>
    </article>
  );
}
