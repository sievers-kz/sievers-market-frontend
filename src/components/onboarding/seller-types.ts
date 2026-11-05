import type { LegalForm } from "@/lib/api";

export type SellerType = "individual" | "legal_entity";

/** Временное соответствие, пока бэкенд не упростил `LegalForm` (backend#213). */
export const SELLER_TYPES: Record<
  SellerType,
  { label: string; legalForm: LegalForm; taxIdLabel: string }
> = {
  individual: { label: "Физическое лицо", legalForm: "IE", taxIdLabel: "ИИН" },
  legal_entity: { label: "Юридическое лицо", legalForm: "LLP", taxIdLabel: "БИН" },
};

/** ИП, ТОО и АО пользователю не показываем, только два типа. */
export const LEGAL_FORM_LABELS: Record<LegalForm, string> = {
  IE: SELLER_TYPES.individual.label,
  FARM: SELLER_TYPES.individual.label,
  LLP: SELLER_TYPES.legal_entity.label,
  JSC: SELLER_TYPES.legal_entity.label,
};
