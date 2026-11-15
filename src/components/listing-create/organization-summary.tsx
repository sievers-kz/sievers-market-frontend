import { ExternalLink, Info } from "lucide-react";
import Link from "next/link";

import { SHOP_FIELD_LABELS, SHOP_FIELD_ORDER } from "@/components/account/organization-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import { missingFieldsOf, type OrganizationDetailsState } from "./use-organization-details";

/** Тексты блока: docs/pages/listing-organization-block.md. */
export const ORGANIZATION_SUMMARY_TEXT = {
  empty: "Не указано",
  /** «Контактный e-mail» в форме объявления по макету; на странице организации «email». */
  labels: { ...SHOP_FIELD_LABELS, contact_email: "Контактный e-mail" },
  noteComplete:
    "Эти данные увидят покупатели в объявлении. Они берутся из организации и здесь не редактируются.",
  noteIncomplete:
    "Чтобы подать объявление, заполните данные магазина в организации — покупатели увидят их в объявлении.",
  /** Ошибка карточки: до отправки по `missing_fields` и после 403. */
  error: "Заполните данные магазина в организации, затем повторите отправку.",
  link: "Изменить в организации",
  newTab: "(откроется в новой вкладке)",
  loadError: "Не удалось загрузить данные организации",
  retry: "Повторить",
} as const;

const T = ORGANIZATION_SUMMARY_TEXT;

export const ORGANIZATION_SUMMARY_MESSAGE_ID = "organization-summary-error";

interface OrganizationSummaryProps {
  organizationId: string;
  state: OrganizationDetailsState;
  onRetry: () => void;
  /** Ошибка «не хватает данных»: сообщение под полями, пустые поля красные. */
  error?: string;
}

/**
 * Данные выбранной организации только для чтения, внутри карточки «Организация».
 * Чего не хватает, решает `missing_fields`; значения нужны только для показа.
 */
export function OrganizationSummary({ organizationId, state, onRetry, error }: OrganizationSummaryProps) {
  if (state.status === "idle") return null;

  const missing = missingFieldsOf(state);
  const errorMessage = error && (
    <p id={ORGANIZATION_SUMMARY_MESSAGE_ID} role="alert" className="text-sm text-destructive">
      {error}
    </p>
  );

  if (state.status === "loading") {
    return (
      <div className="flex flex-col gap-4" aria-busy>
        {SHOP_FIELD_ORDER.map((field) => (
          <div key={field} className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        {errorMessage}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm">{T.loadError}</p>
        <Button type="button" variant="outline" onClick={onRetry}>
          {T.retry}
        </Button>
        {/* 403 мог прийти, пока данные не загрузились: ошибка не теряется. */}
        {errorMessage}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {SHOP_FIELD_ORDER.map((field) => {
          const isMissing = missing.includes(field);
          const id = `organization-${field}`;
          return (
            <div key={field} className="flex flex-col gap-2">
              <Label htmlFor={id}>{T.labels[field]}</Label>
              {/* readOnly, а не disabled: значение читается скринридером. */}
              <Input
                id={id}
                readOnly
                value={isMissing ? "" : (state.organization[field] ?? "")}
                placeholder={T.empty}
                aria-invalid={Boolean(error) && isMissing}
                aria-describedby={error && isMissing ? ORGANIZATION_SUMMARY_MESSAGE_ID : undefined}
                className="bg-muted shadow-none focus-visible:border-muted-foreground focus-visible:ring-0"
              />
            </div>
          );
        })}
        {errorMessage}
      </div>

      <div className="flex gap-4 rounded-xl bg-muted p-4">
        <Info className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-sm">
          {missing.length > 0 ? T.noteIncomplete : T.noteComplete}{" "}
          <Link
            href={`/account/organizations/${encodeURIComponent(organizationId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            {T.link}
            <ExternalLink className="size-4" aria-hidden />
            <span className="sr-only"> {T.newTab}</span>
          </Link>
        </p>
      </div>
    </>
  );
}
