import { z } from "zod";

/** Длина кода и правила пароля в OpenAPI пока не описаны (backend#209). */
export const CONFIRM_CODE_LENGTH = 6;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

const email = z.email("Введите корректный email");

/** Новый пароль: те же правила, что при регистрации. */
export const newPasswordValue = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Минимум ${PASSWORD_MIN_LENGTH} символов`)
  .max(PASSWORD_MAX_LENGTH, `Максимум ${PASSWORD_MAX_LENGTH} символа`);

export const loginSchema = z.object({
  email,
  raw_password: z.string().min(1, "Введите пароль"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email,
    raw_password: newPasswordValue,
    password_repeat: z.string(),
    consent_marketing: z.boolean(),
    consent_personal_data: z
      .boolean()
      .refine(Boolean, "Нужно согласие на обработку персональных данных"),
  })
  .refine((values) => values.raw_password === values.password_repeat, {
    path: ["password_repeat"],
    message: "Пароли не совпадают",
  });
export type RegisterValues = z.infer<typeof registerSchema>;

/** Код из письма: регистрация (`confirm_code`), смена почты и пароля (`otp_code`). */
export const confirmCodeValue = z
  .string()
  .regex(
    new RegExp(`^\\d{${CONFIRM_CODE_LENGTH}}$`),
    `Введите код из ${CONFIRM_CODE_LENGTH} цифр`,
  );

export const confirmCodeSchema = z.object({ confirm_code: confirmCodeValue });
export type ConfirmCodeValues = z.infer<typeof confirmCodeSchema>;
