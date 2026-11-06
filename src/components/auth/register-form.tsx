"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNewUser, ERROR_CODES, showFormError } from "@/lib/api";

import { AuthCard } from "./auth-card";
import { FormField } from "./form-field";
import { FormMessage } from "./form-message";
import { PasswordInput } from "./password-input";
import { registerSchema, type RegisterValues } from "./schemas";
import { SubmitButton } from "./submit-button";

const BY_ERROR_CODE = {
  [ERROR_CODES.accountAlreadyExists]: "email",
  [ERROR_CODES.emailRequired]: "email",
  [ERROR_CODES.invalidEmailFormat]: "email",
  [ERROR_CODES.compromisedPassword]: "raw_password",
  [ERROR_CODES.passwordRequired]: "raw_password",
  [ERROR_CODES.invalidPassword]: "raw_password",
} as const;

export function RegisterForm({ onRegistered }: { onRegistered: (email: string) => void }) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      raw_password: "",
      password_repeat: "",
      consent_marketing: false,
      consent_personal_data: false,
    },
  });

  // Кнопка активна, когда заполнены обязательные поля и дано согласие на обработку данных.
  // Правила (формат email, длина пароля) проверяет схема при отправке.
  const [email, password, passwordRepeat, consentPersonalData] = useWatch({
    control,
    name: ["email", "raw_password", "password_repeat", "consent_personal_data"],
  });
  const canSubmit =
    email.trim() !== "" && password !== "" && passwordRepeat !== "" && consentPersonalData;

  async function onSubmit({ email, raw_password }: RegisterValues) {
    try {
      await createNewUser({ email, raw_password });
      onRegistered(email);
    } catch (error) {
      showFormError(error, setError, { byErrorCode: BY_ERROR_CODE });
    }
  }

  return (
    <AuthCard title="Регистрация">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField id="register-email" label="Email" error={errors.email?.message}>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />
        </FormField>
        <FormField id="register-password" label="Пароль" error={errors.raw_password?.message}>
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.raw_password)}
            aria-describedby={errors.raw_password ? "register-password-error" : undefined}
            {...register("raw_password")}
          />
        </FormField>
        <FormField
          id="register-password-repeat"
          label="Повтор пароля"
          error={errors.password_repeat?.message}
        >
          <PasswordInput
            id="register-password-repeat"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password_repeat)}
            aria-describedby={errors.password_repeat ? "register-password-repeat-error" : undefined}
            {...register("password_repeat")}
          />
        </FormField>

        <Controller
          control={control}
          name="consent_marketing"
          render={({ field }) => (
            <div className="flex items-start gap-2">
              <Checkbox
                id="register-consent-marketing"
                ref={field.ref}
                checked={field.value}
                onBlur={field.onBlur}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              <Label htmlFor="register-consent-marketing" className="block leading-5 font-normal">
                Я соглашаюсь на получение информационных сообщений
              </Label>
            </div>
          )}
        />
        <Controller
          control={control}
          name="consent_personal_data"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="register-consent-data"
                  ref={field.ref}
                  checked={field.value}
                  onBlur={field.onBlur}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? "register-consent-data-error" : undefined}
                />
                <Label htmlFor="register-consent-data" className="block leading-5 font-normal">
                  Я соглашаюсь на обработку персональных данных в соответствии с{" "}
                  <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                    политикой конфиденциальности
                  </Link>{" "}
                  и{" "}
                  <Link href="/terms" target="_blank" className="text-primary hover:underline">
                    пользовательским соглашением
                  </Link>
                </Label>
              </div>
              {fieldState.error && (
                <p id="register-consent-data-error" className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <FormMessage message={errors.root?.message} />
        <SubmitButton pending={isSubmitting} disabled={!canSubmit}>
          Зарегистрироваться
        </SubmitButton>
        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
