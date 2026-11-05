import { z } from "zod";

const CHOICE_ERROR = "Выберите вариант";

function requiredText(message: string) {
  return z.string().trim().min(1, message);
}

export const choiceSchema = z.object({
  choice: z.string({ error: CHOICE_ERROR }).min(1, CHOICE_ERROR),
});
export type ChoiceValues = z.infer<typeof choiceSchema>;

export const customerSchema = z.object({
  last_name: requiredText("Введите фамилию"),
  first_name: requiredText("Введите имя"),
});
export type CustomerValues = z.infer<typeof customerSchema>;

/**
 * В OpenAPI `tax_id` это просто строка. Длина из предметной области;
 * контрольную цифру не считаем, её проверяет сервер при создании продавца.
 */
export const taxIdSchema = z.object({
  tax_id: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Номер должен состоять из 12 цифр"),
});
export type TaxIdValues = z.infer<typeof taxIdSchema>;

export const vendorDetailsSchema = z.object({
  legal_address: requiredText("Введите юридический адрес"),
  contact_last_name: requiredText("Введите фамилию"),
  contact_first_name: requiredText("Введите имя"),
});
export type VendorDetailsValues = z.infer<typeof vendorDetailsSchema>;
