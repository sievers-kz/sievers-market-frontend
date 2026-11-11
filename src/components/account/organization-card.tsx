"use client";

import { RotateCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getOrganization, type OrganizationListItem } from "@/lib/api";

import { DeleteOrganizationDialog } from "./delete-organization-dialog";
import {
  formatTaxId,
  KIND_LABELS,
  ORGANIZATIONS_TEXT,
  STATUS_LABELS,
} from "./organization-labels";
import { OrganizationStatusBadge } from "./organization-status-badge";
import { useRegistryStatusPolling } from "./use-registry-status-polling";

interface OrganizationCardProps {
  organization: OrganizationListItem;
  onUpdate: (organization: OrganizationListItem) => void;
  onRemove: (organizationId: string) => void;
}

export function OrganizationCard({ organization, onUpdate, onRemove }: OrganizationCardProps) {
  const { id, kind, tax_id: taxId, registry_status: status } = organization;
  const [notice, setNotice] = useState<string | null>(null);

  const { stalled, restart } = useRegistryStatusPolling({
    organizationId: id,
    enabled: status === "pending",
    onUpdate,
    onGone: () => onRemove(id),
  });

  const title = organization.shop_name || organization.legal_name || formatTaxId(kind, taxId);
  const hint = status === "pending" && stalled ? null : STATUS_LABELS[status].hint;
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
    <article className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl bg-card p-6">
      <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-lg font-semibold break-words">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {KIND_LABELS[kind].short}, {formatTaxId(kind, taxId)}
          </p>
        </div>
        <OrganizationStatusBadge status={status} checking={status === "pending" && !stalled} />
      </div>

      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}

      {stalled && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">{ORGANIZATIONS_TEXT.pollingStalled}</p>
          <Button type="button" variant="outline" onClick={restart}>
            <RotateCw aria-hidden />
            {ORGANIZATIONS_TEXT.pollAgain}
          </Button>
        </div>
      )}

      {notice && (
        <p role="status" className="text-sm text-destructive">
          {notice}
        </p>
      )}

      {canDelete && (
        <DeleteOrganizationDialog
          organizationId={id}
          onDeleted={() => onRemove(id)}
          onCannotDelete={() => void handleCannotDelete()}
        />
      )}
    </article>
  );
}
