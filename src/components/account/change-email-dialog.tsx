"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type RefObject } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  confirmEmailChange,
  ERROR_CODES,
  isApiError,
  requestEmailChange,
  showFormError,
} from "@/lib/api";

import { AccountCodeStep } from "./account-code-step";
import { ACCOUNT_TEXT, EMAIL_CHANGE_TEXT } from "./account-labels";
import { getEmailChangeSchema, type EmailChangeValues } from "./account-schemas";
import { ACCOUNT_LOGIN_PATH } from "./login-path";
import { returnFocusTo } from "./return-focus";

const T = ACCOUNT_TEXT;
const E = EMAIL_CHANGE_TEXT;
const FIELD_ID = "account-new-email";

type Step = { name: "email"; notice?: string } | { name: "code" };

interface ChangeEmailDialogProps {
  currentEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 200 на шаге 2: почта аккаунта изменена, пользователя надо перечитать. */
  onChanged: (email: string) => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

/**
 * Смена почты в два шага: новый адрес (код уходит на него), затем код из письма.
 * Шаги и введённый адрес живут здесь; диалог пересоздаётся на каждое открытие (`key`).
 */
export function ChangeEmailDialog({
  currentEmail,
  open,
  onOpenChange,
  onChanged,
  returnFocusRef,
}: ChangeEmailDialogProps) {
  const [step, setStep] = useState<Step>({ name: "email" });
  const [email, setEmail] = useState("");
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
          <DialogTitle>{T.email}</DialogTitle>
        </DialogHeader>
        {step.name === "email" ? (
          <EmailStep
            currentEmail={currentEmail}
            initialEmail={email}
            notice={step.notice}
            onBusyChange={setBusy}
            onSent={(next) => {
              setEmail(next);
              setStep({ name: "code" });
            }}
          />
        ) : (
          <AccountCodeStep
            id="account-email-code"
            description={E.codeSent(email)}
            confirm={(otp_code) => confirmEmailChange({ otp_code })}
            resend={() => requestEmailChange({ email })}
            onConfirmed={() => {
              onOpenChange(false);
              onChanged(email);
            }}
            expiredErrorCode={ERROR_CODES.emailChangeRequestNotFound}
            onExpired={() => setStep({ name: "email", notice: E.expired })}
            back={{ label: E.changeAddress, onClick: () => setStep({ name: "email" }) }}
            onBusyChange={setBusy}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EmailStep({
  currentEmail,
  initialEmail,
  notice,
  onBusyChange,
  onSent,
}: {
  currentEmail: string;
  initialEmail: string;
  /** «Код устарел»: после возврата с шага 2. */
  notice?: string;
  onBusyChange: (busy: boolean) => void;
  onSent: (email: string) => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmailChangeValues>({
    resolver: zodResolver(getEmailChangeSchema(currentEmail)),
    defaultValues: { email: initialEmail },
  });

  // Сообщение формы (`root`) RHF сам снимает при следующей отправке.
  useEffect(() => {
    if (notice) setError("root", { type: "notice", message: notice });
  }, [notice, setError]);

  async function onSubmit({ email }: EmailChangeValues) {
    onBusyChange(true);
    try {
      await requestEmailChange({ email });
      onBusyChange(false);
      onSent(email);
    } catch (error) {
      onBusyChange(false);
      if (isApiError(error) && error.status === 401) {
        router.replace(ACCOUNT_LOGIN_PATH);
        return;
      }
      if (isApiError(error) && error.errorCode === ERROR_CODES.accountAlreadyExists) {
        setError("email", { type: "server", message: E.taken }, { shouldFocus: true });
        return;
      }
      // 422 по коду и в формате `detail` — под полем; 429 `otp_cooldown_error`, 5xx, сеть — формой.
      showFormError(error, setError, {
        byErrorCode: {
          [ERROR_CODES.emailRequired]: "email",
          [ERROR_CODES.invalidEmailFormat]: "email",
        },
        fields: ["email"],
      });
    }
  }

  const error = errors.email?.message;
  const hintId = `${FIELD_ID}-hint`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField id={FIELD_ID} label={E.newEmail} hint={E.hint} error={error}>
        <Input
          id={FIELD_ID}
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${hintId} ${FIELD_ID}-error` : hintId}
          {...register("email")}
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
