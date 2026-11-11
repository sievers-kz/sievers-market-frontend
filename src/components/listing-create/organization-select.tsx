"use client";

import Link from "next/link";

import { KIND_LABELS } from "@/components/account/organization-labels";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrganizationListItem } from "@/lib/api";

export const ORGANIZATION_FIELD_ID = "organization_id";

const TEXT = {
  label: "Организация",
  placeholder: "Выберите организацию",
  noVerified: "Нет подтверждённых организаций",
  unverifiedHint: "Некоторые организации ещё не подтверждены и недоступны для выбора.",
  myOrganizations: "Мои организации",
} as const;

export function organizationName(organization: OrganizationListItem): string {
  return organization.shop_name || organization.legal_name || organization.tax_id;
}

/**
 * Какая организация выбрана: выбор пользователя, если он ещё среди подтверждённых,
 * иначе единственная подтверждённая (удобство, а не «организация по умолчанию»), иначе ничего.
 */
export function resolveOrganizationId(
  organizations: readonly OrganizationListItem[],
  chosenId: string,
): string {
  const verified = organizations.filter((item) => item.registry_status === "verified");
  if (verified.some((item) => item.id === chosenId)) return chosenId;
  return verified.length === 1 ? verified[0].id : "";
}

interface OrganizationSelectProps {
  /** Все организации пользователя; к выбору допускаются только `verified`. */
  organizations: readonly OrganizationListItem[];
  value: string;
  onChange: (organizationId: string) => void;
  error?: string;
}

/**
 * Выбор организации, от имени которой подаётся объявление. Дизайн не утверждён
 * (docs/pages/listing-create.md, «Организация»): компонент не знает о раскладке формы,
 * его можно перенести или заменить карточками.
 */
export function OrganizationSelect({ organizations, value, onChange, error }: OrganizationSelectProps) {
  const verified = organizations.filter((item) => item.registry_status === "verified");
  const hasUnverified = verified.length < organizations.length;
  // Без подтверждённых (их могли удалить после открытия формы) ссылка нужна в любом случае.
  const showHint = hasUnverified || verified.length === 0;
  const selected = verified.find((item) => item.id === value);
  const errorId = `${ORGANIZATION_FIELD_ID}-error`;
  const hintId = `${ORGANIZATION_FIELD_ID}-hint`;
  const describedBy = [error && errorId, showHint && hintId].filter(Boolean).join(" ");

  return (
    <section aria-label={TEXT.label} className="flex flex-col gap-2 rounded-2xl bg-card p-6">
      <Label htmlFor={ORGANIZATION_FIELD_ID}>
        {TEXT.label}
        <span className="text-destructive" aria-hidden>
          *
        </span>
      </Label>
      <Select value={value} onValueChange={onChange} disabled={verified.length === 0}>
        <SelectTrigger
          id={ORGANIZATION_FIELD_ID}
          className="w-full"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
        >
          <SelectValue placeholder={verified.length === 0 ? TEXT.noVerified : TEXT.placeholder}>
            {selected && <span className="truncate">{organizationName(selected)}</span>}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {verified.map((organization) => (
            <SelectItem key={organization.id} value={organization.id}>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{organizationName(organization)}</span>
                <span className="text-muted-foreground">
                  {organization.tax_id} · {KIND_LABELS[organization.kind].short}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
      {showHint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hasUnverified ? `${TEXT.unverifiedHint} ` : ""}
          <Link href="/account/organizations" className="text-primary underline-offset-4 hover:underline">
            {TEXT.myOrganizations}
          </Link>
        </p>
      )}
    </section>
  );
}
