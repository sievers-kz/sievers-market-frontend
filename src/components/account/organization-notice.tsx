import { CircleAlert, Info, PencilLine } from "lucide-react";

import type { OrganizationDetails } from "@/lib/api";
import { cn } from "@/lib/utils";

import { ORGANIZATION_DETAIL_TEXT } from "./organization-labels";

const T = ORGANIZATION_DETAIL_TEXT.notice;

/**
 * Одна подсказка под шапкой по состоянию организации. У `verified` она про данные
 * магазина и только если `missing_fields` не пуст: список считает бэкенд, поля не перечисляем.
 */
export function OrganizationNotice({ organization }: { organization: OrganizationDetails }) {
  const notice = getNotice(organization);
  if (!notice) return null;
  const { Icon, iconClass, text } = notice;

  return (
    <div role="status" className="flex items-start gap-4 rounded-2xl bg-card p-6">
      <Icon aria-hidden className={cn("size-6 shrink-0", iconClass)} />
      <p className="min-w-0 flex-1">{text}</p>
    </div>
  );
}

function getNotice({ registry_status: status, missing_fields: missing }: OrganizationDetails) {
  if (status === "pending") {
    return { Icon: Info, iconClass: "text-muted-foreground", text: T.pending };
  }
  if (status === "not_found") {
    return { Icon: CircleAlert, iconClass: "text-destructive", text: T.not_found };
  }
  if (missing && missing.length > 0) {
    return { Icon: PencilLine, iconClass: "text-cta", text: T.missingFields };
  }
  return null;
}
