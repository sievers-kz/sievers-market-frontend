"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useResendCooldown } from "@/hooks/use-resend-cooldown";
import {
  confirmAccount,
  ERROR_CODES,
  isApiError,
  resendConfirmationCode,
  showFormError,
} from "@/lib/api";

import { AuthCard } from "./auth-card";
import { ConfirmCodeInput } from "./confirm-code-input";
import { FormMessage } from "./form-message";
import { getPostAuthPath } from "./post-auth-path";
import { confirmCodeSchema, type ConfirmCodeValues } from "./schemas";
import { SubmitButton } from "./submit-button";

const FIELD_ID = "confirm-code";
const ERROR_ID = `${FIELD_ID}-error`;

export function ConfirmCodeForm({ email }: { email: string }) {
  const router = useRouter();
  // Отсчёт начинается при показе шага.
  const { secondsLeft, restart: restartCooldown } = useResendCooldown();
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
      restartCooldown();
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
              <ConfirmCodeInput
                id={FIELD_ID}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                invalid={invalid}
                errorId={ERROR_ID}
              />
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
