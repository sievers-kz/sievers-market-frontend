import { z } from "zod";

import { ORGANIZATION_DETAIL_TEXT, type ShopField } from "./organization-labels";

const T = ORGANIZATION_DETAIL_TEXT;

/**
 * Правила из описаний операций правки: в OpenAPI у `shop_name` и `contact_phone`
 * ограничений нет (просто строки), у `contact_email` только `format: email`.
 */
const FIELD_SCHEMAS: Record<ShopField, z.ZodType<string, string>> = {
  // Бэкенд схлопывает пробелы и проверяет 2–50 символов и хотя бы одну букву.
  shop_name: z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(1, T.requiredField)
        .min(2, T.shopNameInvalid)
        .max(50, T.shopNameInvalid)
        .regex(/\p{L}/u, T.shopNameInvalid),
    ),
  // Формат проверяет и нормализует бэкенд (E.164).
  contact_phone: z.string().trim().min(1, T.requiredField),
  contact_email: z
    .string()
    .trim()
    .min(1, T.requiredField)
    .max(255, T.emailTooLong)
    .pipe(z.email(T.emailInvalid)),
};

/** Форма диалога всегда из одного поля `value`; имя поля API знает сам диалог. */
export function getShopFieldSchema(field: ShopField) {
  return z.object({ value: FIELD_SCHEMAS[field] });
}

export type ShopFieldValues = { value: string };
