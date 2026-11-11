"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  confirmAccount,
  ERROR_CODES,
  isApiError,
  resendConfirmationCode,
  showFormError,
} from "@/lib/api";

import { AuthCard } from "./auth-card";
import { FormMessage } from "./form-message";
import { getPostAuthPath } from "./post-auth-path";
import { CONFIRM_CODE_LENGTH, confirmCodeSchema, type ConfirmCodeValues } from "./schemas";
import { SubmitButton } from "./submit-button";

/** Бэкенд не отдаёт время ожидания (backend#203). Отсчёт начинается при показе шага. */
const RESEND_COOLDOWN_SECONDS = 60;

const FIELD_ID = "confirm-code";
const ERROR_ID = `${FIELD_ID}-error`;

export function ConfirmCodeForm({ email }: { email: string }) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    setFocus,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ConfirmCodeValues>({
    resolver: zodResolver(confirmCodeSchema),
    defaultValues: { confirm_code: "" },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  async function onSubmit({ confirm_code }: ConfirmCodeValues) {
    try {
      await confirmAccount({ email, confirm_code });
      router.replace(getPostAuthPath());
      router.refresh();
    } catch (error) {
      showFormError(error, setError, {
        byErrorCode: { [ERROR_CODES.invalidOtpCode]: "confirm_code" },
      });
      if (isApiError(error) && error.errorCode === ERROR_CODES.invalidOtpCode) {
        setValue("confirm_code", "");
        setFocus("confirm_code");
      }
    }
  }

  async function onResend() {
    clearErrors("root");
    setResent(false);
    setResending(true);
    try {
      await resendConfirmationCode({ email });
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setResent(true);
    } catch (error) {
      showFormError(error, setError);
    } finally {
      setResending(false);
    }
  }

  const invalid = Boolean(errors.confirm_code);

  return (
    <AuthCard
      title="Подтвердите электронную почту"
      description={`Мы отправили код на ${email}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={FIELD_ID}>Код из письма</Label>
          <Controller
            control={control}
            name="confirm_code"
            render={({ field }) => (
              <InputOTP
                id={FIELD_ID}
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                maxLength={CONFIRM_CODE_LENGTH}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                aria-invalid={invalid}
                aria-describedby={invalid ? ERROR_ID : undefined}
              >
                <InputOTPGroup>
                  {Array.from({ length: CONFIRM_CODE_LENGTH }, (_, index) => (
                    <InputOTPSlot key={index} index={index} aria-invalid={invalid} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.confirm_code && (
            <p id={ERROR_ID} className="text-sm text-destructive">
              {errors.confirm_code.message}
            </p>
          )}
        </div>
        <FormMessage message={errors.root?.message} />
        <SubmitButton pending={isSubmitting || isSubmitSuccessful}>Подтвердить</SubmitButton>
        <Button
          type="button"
          variant="ghost"
          disabled={secondsLeft > 0 || resending}
          onClick={onResend}
        >
          {secondsLeft > 0
            ? `Отправить код ещё раз через ${secondsLeft} с`
            : "Отправить код ещё раз"}
        </Button>
        <p role="status" className="text-center text-sm text-muted-foreground">
          {resent ? "Новый код отправлен" : ""}
        </p>
      </form>
    </AuthCard>
  );
}
