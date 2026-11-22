import type { OrganizationCard as OrganizationCardData } from "@/lib/api";

import { OrganizationCard } from "./organization-card";

/** Сетка каталога: 2 колонки на телефоне, 4 с `lg`. */
export const ORGANIZATIONS_GRID_CLASS = "grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6";

export function OrganizationsGrid({ items }: { items: OrganizationCardData[] }) {
  return (
    <ul className={ORGANIZATIONS_GRID_CLASS}>
      {items.map((organization) => (
        <li key={organization.id} className="flex min-w-0">
          <OrganizationCard organization={organization} />
        </li>
      ))}
    </ul>
  );
}
