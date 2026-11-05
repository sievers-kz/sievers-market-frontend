import { apiFetch } from "./client";
import type { components } from "./schema";

type Schemas = components["schemas"];

export type LegalForm = Schemas["LegalForm"];
export type Taxpayer = Schemas["TaxpayerResponse"];

/** Запрос идёт во внешний реестр (КГД) и может занять до 15 секунд. */
export function verifyTaxpayer(taxId: string, legalForm: LegalForm): Promise<Taxpayer> {
  return apiFetch<Taxpayer>(`/api/v1/vendor/taxpayer/${encodeURIComponent(taxId)}`, {
    query: { legal_form: legalForm },
    cache: "no-store",
  });
}

export async function createVendor(body: Schemas["CreateVendorRequest"]): Promise<void> {
  await apiFetch<unknown>("/api/v1/vendor/", { method: "POST", body });
}
