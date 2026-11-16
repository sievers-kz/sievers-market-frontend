"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type RefObject } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  confirmPasswordChange,
  ERROR_CODES,
  isApiError,
  requestPasswordChange,
  showFormError,
} from "@/lib/api";

import { AccountCodeStep } from "./account-code-step";
import { ACCOUNT_TEXT, PASSWORD_CHANGE_TEXT } from "./account-labels";
import { passwordChangeSchema, type PasswordChangeValues } from "./account-schemas";
import { ACCOUNT_LOGIN_PATH } from "./login-path";
import { returnFocusTo } from "./return-focus";

const T = ACCOUNT_TEXT;
const P = PASSWORD_CHANGE_TEXT;

/** Тело `requestPasswordChange`: повтор пароля в API не уходит. */
type PasswordChangeRequest = Pick<PasswordChangeValues, "raw_password" | "new_password">;

type Step =
  | { name: "passwords"; notice?: string }
  | { name: "code"; request: PasswordChangeRequest };

/** Ошибки нового пароля: под полем «Новый пароль» с текстом сервера. */
const NEW_PASSWORD_ERRORS: readonly string[] = [
  ERROR_CODES.invalidPassword,
  ERROR_CODES.passwordRequired,
  ERROR_CODES.compromisedPassword,
];

interface ChangePasswordDialogProps {
  /** Текущая почта: на неё уходит код. */
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 200 на шаге 2: бэкенд уже завершил сессию. */
  onChanged: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

/**
 * Смена пароля в два шага: текущий и новый пароль (код уходит на текущую почту),
 * затем код. Пароли живут только в состоянии формы и шага, для повторной отправки.
 */
export function ChangePasswordDialog({
  email,
  open,
  onOpenChange,
  onChanged,
  returnFocusRef,
}: ChangePasswordDialogProps) {
  const [step, setStep] = useState<Step>({ name: "passwords" });
  const [busy, setBusy] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        onOpenChange(next);
      }}
    >
      <DialogContent aria-describedby={undefined} onCloseAutoFocus={returnFocusTo(returnFocusRef)}>
        <DialogHeader>
          <DialogTitle>{T.password}</DialogTitle>
        </DialogHeader>
        {step.name === "passwords" ? (
          <PasswordsStep
            notice={step.notice}
            onBusyChange={setBusy}
            onSent={(request) => setStep({ name: "code", request })}
          />
        ) : (
          <AccountCodeStep
            id="account-password-code"
            description={P.codeSent(email)}
            confirm={(otp_code) => confirmPasswordChange({ otp_code })}
            resend={() => requestPasswordChange(step.request)}
            onConfirmed={onChanged}
            expiredErrorCode={ERROR_CODES.passwordChangeRequestNotFound}
            onExpired={() => setStep({ name: "passwords", notice: P.expired })}
            onBusyChange={setBusy}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

const FIELD_IDS = {
  raw_password: "account-current-password",
  new_password: "account-new-password",
  new_password_repeat: "account-new-password-repeat",
} as const;

function PasswordsStep({
  notice,
  onBusyChange,
  onSent,
}: {
  /** «Код устарел»: после возврата с шага 2, поля пустые. */
  notice?: string;
  onBusyChange: (busy: boolean) => void;
  onSent: (request: PasswordChangeRequest) => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { raw_password: "", new_password: "", new_password_repeat: "" },
  });

  // Сообщение формы (`root`) RHF сам снимает при следующей отправке.
  useEffect(() => {
    if (notice) setError("root", { type: "notice", message: notice });
  }, [notice, setError]);

  async function onSubmit({ raw_password, new_password }: PasswordChangeValues) {
    const request = { raw_password, new_password };
    onBusyChange(true);
    try {
      await requestPasswordChange(request);
      onBusyChange(false);
      onSent(request);
    } catch (error) {
      onBusyChange(false);
      if (isApiError(error) && error.status === 401) {
        router.replace(ACCOUNT_LOGIN_PATH);
        return;
      }
      if (isApiError(error) && error.errorCode === ERROR_CODES.passwordMismatch) {
        // Серверный текст «Введенные вами пароли не совпадают» вводит в заблуждение.
        setError("raw_password", { type: "server", message: P.wrongCurrent }, { shouldFocus: true });
        return;
      }
      if (isApiError(error) && error.errorCode && NEW_PASSWORD_ERRORS.includes(error.errorCode)) {
        setError("new_password", { type: "server", message: error.message }, { shouldFocus: true });
        return;
      }
      // 422 `detail` по `loc` (`raw_password`, `new_password`); 429, 5xx, сеть — формой.
      showFormError(error, setError, { fields: ["raw_password", "new_password"] });
    }
  }

  const describedBy = (field: keyof typeof FIELD_IDS, hint = false) => {
    const id = FIELD_IDS[field];
    const parts = [hint && `${id}-hint`, errors[field] && `${id}-error`].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField
        id={FIELD_IDS.raw_password}
        label={P.current}
        error={errors.raw_password?.message}
      >
        <PasswordInput
          id={FIELD_IDS.raw_password}
          autoComplete="current-password"
          aria-invalid={Boolean(errors.raw_password)}
          aria-describedby={describedBy("raw_password")}
          {...register("raw_password")}
        />
      </FormField>
      <FormField
        id={FIELD_IDS.new_password}
        label={P.next}
        hint={P.hint}
        error={errors.new_password?.message}
      >
        <PasswordInput
          id={FIELD_IDS.new_password}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.new_password)}
          aria-describedby={describedBy("new_password", true)}
          {...register("new_password")}
        />
      </FormField>
      <FormField
        id={FIELD_IDS.new_password_repeat}
        label={P.repeat}
        error={errors.new_password_repeat?.message}
      >
        <PasswordInput
          id={FIELD_IDS.new_password_repeat}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.new_password_repeat)}
          aria-describedby={describedBy("new_password_repeat")}
          {...register("new_password_repeat")}
        />
      </FormField>
      <FormMessage message={errors.root?.message} />
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
      >
        {isSubmitting && <LoaderCircle aria-hidden className="animate-spin" />}
        {isSubmitting ? T.sendCodePending : T.sendCode}
      </Button>
    </form>
  );
}
