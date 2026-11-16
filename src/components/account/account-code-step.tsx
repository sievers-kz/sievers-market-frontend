"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ConfirmCodeInput } from "@/components/auth/confirm-code-input";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useResendCooldown } from "@/hooks/use-resend-cooldown";
import { ERROR_CODES, isApiError, showFormError } from "@/lib/api";

import { ACCOUNT_TEXT } from "./account-labels";
import { otpCodeSchema, type OtpCodeValues } from "./account-schemas";
import { ACCOUNT_LOGIN_PATH } from "./login-path";

const T = ACCOUNT_TEXT;

interface AccountCodeStepProps {
  /** id ячеек кода, уникальный в диалоге. */
  id: string;
  /** «Мы отправили код на …». */
  description: string;
  /** Шаг 2: отправить код. Ошибку бросает, успех обрабатывает `onConfirmed`. */
  confirm: (otpCode: string) => Promise<void>;
  /** Повторный вызов шага 1 с теми же данными. */
  resend: () => Promise<void>;
  onConfirmed: () => void;
  /** Код запроса, который означает «запрос устарел»: тогда `onExpired`. */
  expiredErrorCode: string;
  onExpired: () => void;
  /** Кнопка-ссылка под «Отправить код ещё раз» (у почты «Изменить адрес»). */
  back?: { label: string; onClick: () => void };
  /** Блокирует закрытие диалога, пока идёт запрос. */
  onBusyChange: (busy: boolean) => void;
}

/**
 * Шаг с кодом из письма в диалогах смены почты и пароля: ячейки, «Подтвердить»
 * и повторная отправка с отсчётом 60 с от показа шага (как в регистрации).
 */
export function AccountCodeStep({
  id,
  description,
  confirm,
  resend,
  onConfirmed,
  expiredErrorCode,
  onExpired,
  back,
  onBusyChange,
}: AccountCodeStepProps) {
  const router = useRouter();
  const errorId = `${id}-error`;
  const { secondsLeft, restart } = useResendCooldown();
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
  } = useForm<OtpCodeValues>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: { otp_code: "" },
  });

  async function onSubmit({ otp_code }: OtpCodeValues) {
    onBusyChange(true);
    try {
      await confirm(otp_code);
      onBusyChange(false);
      onConfirmed();
    } catch (error) {
      onBusyChange(false);
      if (isApiError(error) && error.status === 401) {
        router.replace(ACCOUNT_LOGIN_PATH);
        return;
      }
      if (isApiError(error) && error.errorCode === expiredErrorCode) {
        onExpired();
        return;
      }
      showFormError(error, setError, {
        byErrorCode: { [ERROR_CODES.invalidOtpCode]: "otp_code" },
        fields: ["otp_code"],
      });
      if (isApiError(error) && error.errorCode === ERROR_CODES.invalidOtpCode) {
        setValue("otp_code", "");
        setFocus("otp_code");
      }
    }
  }

  async function onResend() {
    clearErrors("root");
    setResent(false);
    setResending(true);
    onBusyChange(true);
    try {
      await resend();
      restart();
      setResent(true);
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        router.replace(ACCOUNT_LOGIN_PATH);
        return;
      }
      // 429 `otp_cooldown_error` и прочее: текст сервера сообщением формы.
      showFormError(error, setError, { fields: [] });
    } finally {
      setResending(false);
      onBusyChange(false);
    }
  }

  const invalid = Boolean(errors.otp_code);
  const pending = isSubmitting || isSubmitSuccessful;
  const busy = pending || resending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>{T.codeLabel}</Label>
        <Controller
          control={control}
          name="otp_code"
          render={({ field }) => (
            <ConfirmCodeInput
              id={id}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              invalid={invalid}
              errorId={errorId}
            />
          )}
        />
        {errors.otp_code && (
          <p id={errorId} className="text-sm text-destructive">
            {errors.otp_code.message}
          </p>
        )}
      </div>
      <FormMessage message={errors.root?.message} />
      <Button
        type="submit"
        size="lg"
        disabled={busy}
        aria-busy={pending}
        className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
      >
        {pending && <LoaderCircle aria-hidden className="animate-spin" />}
        {T.confirm}
      </Button>
      <div className="flex flex-col items-center">
        <Button
          type="button"
          variant="ghost"
          disabled={secondsLeft > 0 || busy}
          onClick={onResend}
          className="text-primary hover:text-primary"
        >
          {secondsLeft > 0 ? T.resendIn(secondsLeft) : T.resend}
        </Button>
        {back && (
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={back.onClick}
            className="text-primary hover:text-primary"
          >
            {back.label}
          </Button>
        )}
      </div>
      <p role="status" className="text-center text-sm text-muted-foreground">
        {resent ? T.resent : ""}
      </p>
    </form>
  );
}
