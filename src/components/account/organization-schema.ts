import { z } from "zod";

import { KIND_ORDER, ORGANIZATIONS_TEXT } from "./organization-labels";

/** Номер ИИН/БИН: ровно 12 цифр. В OpenAPI ограничение описано только текстом (`tax_id: string`). */
export const TAX_ID_RE = /^\d{12}$/;
export const TAX_ID_LENGTH = 12;

/** Повторяет `CreateOrganizationRequest`. */
export const organizationSchema = z.object({
  kind: z.enum(KIND_ORDER, { error: ORGANIZATIONS_TEXT.kindRequired }),
  tax_id: z.string().regex(TAX_ID_RE, ORGANIZATIONS_TEXT.taxIdInvalid),
});

export type OrganizationValues = z.infer<typeof organizationSchema>;
