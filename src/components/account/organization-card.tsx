"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { getOrganization, type OrganizationListItem } from "@/lib/api";

import { DeleteOrganizationDialog } from "./delete-organization-dialog";
import { formatTaxId, ORGANIZATIONS_TEXT } from "./organization-labels";
import { OrganizationActionsMenu } from "./organization-actions-menu";
import { OrganizationStatusBadge } from "./organization-status-badge";
import { useRegistryStatusPolling } from "./use-registry-status-polling";

interface OrganizationCardProps {
  organization: OrganizationListItem;
  onUpdate: (organization: OrganizationListItem) => void;
  onRemove: (organizationId: string) => void;
}

/**
 * Все карточки одинаковы, различает их только тег статуса: сверху тег и меню «⋯»,
 * ниже квадрат с иконкой, название в одну строку и номер. Подсказок в карточке нет.
 * Вся карточка ведёт на страницу организации: ссылка в заголовке растянута на карточку
 * (`after:inset-0`), меню «⋯» лежит над ней (`z-10`), а не внутри `<a>`.
 */
export function OrganizationCard({ organization, onUpdate, onRemove }: OrganizationCardProps) {
  const { id, kind, tax_id: taxId, registry_status: status } = organization;
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const { stalled, restart } = useRegistryStatusPolling({
    organizationId: id,
    enabled: status === "pending",
    onUpdate,
    onGone: () => onRemove(id),
  });

  const title =
    organization.shop_name || organization.legal_name || ORGANIZATIONS_TEXT.fallbackTitle;
  const canDelete = status === "pending" || status === "not_found";

  async function handleCannotDelete() {
    setNotice(ORGANIZATIONS_TEXT.deleteVerified);
    try {
      onUpdate(await getOrganization(id));
    } catch {
      // Статус обновится при следующей загрузке страницы.
    }
  }

  return (
    <article className="relative flex min-w-0 flex-1 flex-col gap-4 rounded-2xl bg-card p-6 transition-shadow hover:shadow-md">
      <div className="flex h-8 items-center justify-between gap-4">
        <OrganizationStatusBadge status={status} checking={status === "pending" && !stalled} />
        {/* У `verified` меню нет, место под кнопку остаётся. */}
        {canDelete ? (
          <div className="relative z-10">
            <OrganizationActionsMenu
              triggerRef={menuTriggerRef}
              onDelete={() => setDeleteOpen(true)}
              onPollAgain={stalled ? restart : undefined}
            />
          </div>
        ) : (
          <span aria-hidden className="size-8 shrink-0" />
        )}
      </div>

      <div className="flex min-w-0 items-center gap-4">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
        >
          <Building2 className="size-6" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="truncate text-base font-semibold">
            <Link
              href={`/account/organizations/${encodeURIComponent(id)}`}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {title}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground">{formatTaxId(kind, taxId)}</p>
        </div>
      </div>

      {/* Спека не задаёт место для этого сообщения; оставлено в карточке, как было. */}
      {notice && (
        <p role="status" className="text-sm text-destructive">
          {notice}
        </p>
      )}

      {canDelete && (
        <DeleteOrganizationDialog
          organizationId={id}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleted={() => onRemove(id)}
          onCannotDelete={() => void handleCannotDelete()}
          returnFocusRef={menuTriggerRef}
        />
      )}
    </article>
  );
}
