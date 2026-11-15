import Link from "next/link";

import { SHOP_FIELD_LABELS, SHOP_FIELD_ORDER } from "@/components/account/organization-labels";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { missingFieldsOf, type OrganizationDetailsState } from "./use-organization-details";

/** Тексты блока: docs/pages/listing-organization-block.md. Дизайн не утверждён. */
export const ORGANIZATION_SUMMARY_TEXT = {
  heading: "Покупатель увидит",
  empty: "Не указано",
  /** И подсказка, и ошибка блока (до отправки и после 403). */
  incomplete: "Заполните данные магазина, чтобы подать объявление",
  fillLink: "Заполнить в организации",
  editLink: "Изменить в организации",
  newTab: "(откроется в новой вкладке)",
  loadError: "Не удалось загрузить данные организации",
  retry: "Повторить",
} as const;

const T = ORGANIZATION_SUMMARY_TEXT;

export const ORGANIZATION_SUMMARY_MESSAGE_ID = "organization-summary-message";

interface OrganizationSummaryProps {
  organizationId: string;
  state: OrganizationDetailsState;
  onRetry: () => void;
  /** Ошибка «не хватает данных»: красная рамка и красная подсказка. */
  error?: string;
}

/**
 * Данные выбранной организации только для чтения, внутри карточки «Организация».
 * Чего не хватает, решает `missing_fields`; значения нужны только для показа.
 */
export function OrganizationSummary({ organizationId, state, onRetry, error }: OrganizationSummaryProps) {
  if (state.status === "idle") return null;

  const missing = missingFieldsOf(state);
  const ready = state.status === "ready";
  const message = error ?? (missing.length > 0 ? T.incomplete : undefined);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-transparent bg-muted p-4",
        error && "border-destructive",
      )}
      aria-busy={state.status === "loading"}
    >
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-4">
        <p className="text-sm text-muted-foreground">{T.heading}</p>
        {ready && (
          <Link
            href={`/account/organizations/${encodeURIComponent(organizationId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center text-sm text-primary underline-offset-4 hover:underline"
          >
            {missing.length > 0 ? T.fillLink : T.editLink}
            <span className="sr-only"> {T.newTab}</span>
          </Link>
        )}
      </div>

      {state.status === "loading" && (
        <div className="flex flex-col gap-4">
          {SHOP_FIELD_ORDER.map((field) => (
            <div key={field} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-48" />
            </div>
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm">{T.loadError}</p>
          <Button type="button" variant="outline" onClick={onRetry}>
            {T.retry}
          </Button>
        </div>
      )}

      {ready && (
        <dl className="flex flex-col gap-4">
          {SHOP_FIELD_ORDER.map((field) => {
            const isMissing = missing.includes(field);
            const value = state.organization[field];
            return (
              <div
                key={field}
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <dt className="shrink-0 text-sm text-muted-foreground">
                  {SHOP_FIELD_LABELS[field]}
                  <span aria-hidden className="text-destructive">
                    {" *"}
                  </span>
                </dt>
                <dd
                  className={cn(
                    "min-w-0 text-base break-words sm:text-right",
                    (isMissing || !value) && "text-muted-foreground",
                  )}
                >
                  {isMissing || !value ? T.empty : value}
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      {/* Ошибку показываем и без данных: 403 мог прийти, пока они не загрузились. */}
      {message && (ready || error) && (
        <p
          id={ORGANIZATION_SUMMARY_MESSAGE_ID}
          role={error ? "alert" : undefined}
          className={cn("text-sm", error && "text-destructive")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
