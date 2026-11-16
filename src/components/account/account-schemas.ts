import { z } from "zod";

import { confirmCodeValue, newPasswordValue } from "@/components/auth/schemas";

import { EMAIL_CHANGE_TEXT, FULLNAME_TEXT, PASSWORD_CHANGE_TEXT } from "./account-labels";

/*
 * Схемы форм страницы «Аккаунт». Поля называются как в DTO OpenAPI. Правил ФИО
 * в OpenAPI нет: они взяты из бэкенда (буквы трёх алфавитов, пробел, дефис).
 */

const NAME_PATTERN = /^[a-zA-Zа-яА-ЯёЁӘәҒғҚқҢңӨөҰұҮүҺһІі\s-]+$/;

/** Бэкенд пробелы не обрезает: обрезаем и схлопываем сами. */
export function normalizeName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

const requiredName = (requiredMessage: string) =>
  z
    .string()
    .transform(normalizeName)
    .pipe(z.string().min(1, requiredMessage).regex(NAME_PATTERN, FULLNAME_TEXT.invalid));

export const fullnameSchema = z.object({
  last_name: requiredName(FULLNAME_TEXT.lastNameRequired),
  first_name: requiredName(FULLNAME_TEXT.firstNameRequired),
  // Пустое отчество уходит как `null`.
  patronymic: z
    .string()
    .transform(normalizeName)
    .pipe(z.union([z.literal(""), z.string().regex(NAME_PATTERN, FULLNAME_TEXT.invalid)]))
    .transform((value) => value || null),
});
export type FullnameInput = z.input<typeof fullnameSchema>;
export type FullnameOutput = z.output<typeof fullnameSchema>;

/** Новый адрес не должен совпадать с текущим (без учёта регистра). */
export function getEmailChangeSchema(currentEmail: string) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, EMAIL_CHANGE_TEXT.required)
      .pipe(z.email(EMAIL_CHANGE_TEXT.invalid))
      .refine(
        (value) => value.toLowerCase() !== currentEmail.trim().toLowerCase(),
        EMAIL_CHANGE_TEXT.same,
      ),
  });
}
export type EmailChangeValues = { email: string };

/** Повтор нового пароля проверяется только здесь и в API не уходит. */
export const passwordChangeSchema = z
  .object({
    raw_password: z.string().min(1, PASSWORD_CHANGE_TEXT.currentRequired),
    new_password: newPasswordValue,
    new_password_repeat: z.string(),
  })
  .refine((values) => values.new_password === values.new_password_repeat, {
    path: ["new_password_repeat"],
    message: PASSWORD_CHANGE_TEXT.mismatch,
  });
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;

export const otpCodeSchema = z.object({ otp_code: confirmCodeValue });
export type OtpCodeValues = z.infer<typeof otpCodeSchema>;
