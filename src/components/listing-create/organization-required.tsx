import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { OrganizationListItem } from "@/lib/api";

const TEXT = {
  none: "Чтобы подать объявление, добавьте организацию",
  addOrganization: "Добавить организацию",
  pending:
    "Мы проверяем вашу организацию в реестре. Подавать объявления можно после подтверждения",
  notFound: "Организацию не удалось найти в реестре. Проверьте номер или добавьте другую",
  myOrganizations: "Мои организации",
} as const;

interface OrganizationRequiredProps {
  /** Организации пользователя, среди которых нет ни одной `verified`. */
  organizations: readonly OrganizationListItem[];
}

/** Заглушка вместо формы: подавать объявления можно только от подтверждённой организации. */
export function OrganizationRequired({ organizations }: OrganizationRequiredProps) {
  const isEmpty = organizations.length === 0;
  const hasPending = organizations.some((item) => item.registry_status === "pending");
  const message = isEmpty ? TEXT.none : hasPending ? TEXT.pending : TEXT.notFound;

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
      <p className="max-w-xl text-lg font-medium">{message}</p>
      <Button asChild className="bg-cta text-cta-foreground hover:bg-cta/90">
        <Link href="/account/organizations">
          {isEmpty ? TEXT.addOrganization : TEXT.myOrganizations}
        </Link>
      </Button>
    </div>
  );
}
