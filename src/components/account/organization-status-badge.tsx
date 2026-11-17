import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RegistryStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

import { STATUS_LABELS } from "./organization-labels";

/**
 * `pending` нейтральный. Спека просит `text-muted-foreground`, но на `bg-muted` это 4.39:1,
 * поэтому текст `foreground`, как у бейджа «Скоро» в сайдбаре.
 */
const STATUS_STYLES: Record<RegistryStatus, string> = {
  pending: "bg-muted text-foreground",
  verified: "bg-cta/10 text-cta",
  not_found: "bg-destructive/10 text-destructive",
};

/** Статус передаётся текстом и иконкой, не одним цветом. */
export function OrganizationStatusBadge({
  status,
  checking,
}: {
  status: RegistryStatus;
  /** Идёт опрос: у «Проверяем» крутится индикатор. */
  checking: boolean;
}) {
  return (
    <Badge className={cn("text-sm", STATUS_STYLES[status])}>
      {status === "pending" && (
        <LoaderCircle
          aria-hidden
          className={cn("size-4!", checking && "animate-spin motion-reduce:animate-none")}
        />
      )}
      {status === "verified" && <CircleCheck aria-hidden className="size-4!" />}
      {status === "not_found" && <CircleAlert aria-hidden className="size-4!" />}
      {STATUS_LABELS[status].badge}
    </Badge>
  );
}
