"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { useForm, useWatch } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { changeCustomerFullname, isApiError, showFormError, type CurrentUser } from "@/lib/api";

import { ACCOUNT_TEXT, FULLNAME_TEXT } from "./account-labels";
import {
  fullnameSchema,
  normalizeName,
  type FullnameInput,
  type FullnameOutput,
} from "./account-schemas";
import { ACCOUNT_LOGIN_PATH } from "./login-path";
import { returnFocusTo } from "./return-focus";

const T = ACCOUNT_TEXT;
const FIELDS = ["last_name", "first_name", "patronymic"] as const;

const INPUTS = {
  last_name: { label: FULLNAME_TEXT.lastName, autoComplete: "family-name", required: true },
  first_name: { label: FULLNAME_TEXT.firstName, autoComplete: "given-name", required: true },
  patronymic: { label: FULLNAME_TEXT.patronymic, autoComplete: "additional-name", required: false },
} as const;

interface EditFullnameDialogProps {
  user: CurrentUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 200: значения, ушедшие на бэкенд. */
  onSaved: (fullname: FullnameOutput) => void;
  /** Кнопка «Изменить» / «Заполнить», открывшая диалог. */
  returnFocusRef: RefObject<HTMLElement | null>;
}

/** Правка ФИО. Форма создаётся заново на каждое открытие (родитель меняет `key`). */
export function EditFullnameDialog({
  user,
  open,
  onOpenChange,
  onSaved,
  returnFocusRef,
}: EditFullnameDialogProps) {
  const router = useRouter();
  const initial: FullnameInput = {
    last_name: user.last_name ?? "",
    first_name: user.first_name ?? "",
    patronymic: user.patronymic ?? "",
  };
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FullnameInput, unknown, FullnameOutput>({
    resolver: zodResolver(fullnameSchema),
    defaultValues: initial,
  });

  const values = useWatch({ control });
  const changed = FIELDS.some(
    (field) => normalizeName(values[field] ?? "") !== normalizeName(initial[field]),
  );
  const filled =
    normalizeName(values.last_name ?? "") !== "" && normalizeName(values.first_name ?? "") !== "";

  async function onSubmit(fullname: FullnameOutput) {
    try {
      await changeCustomerFullname(fullname);
      onOpenChange(false);
      onSaved(fullname);
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        router.replace(ACCOUNT_LOGIN_PATH);
        return;
      }
      // 422 по коду (`metadata.field`) и в формате `detail` — под поле с тем же именем;
      // 403 `customer_profile_required_error`, 5xx и сеть — сообщением формы.
      showFormError(error, setError, { fields: FIELDS });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSubmitting) return;
        onOpenChange(next);
      }}
    >
      <DialogContent aria-describedby={undefined} onCloseAutoFocus={returnFocusTo(returnFocusRef)}>
        <DialogHeader>
          <DialogTitle>{T.fullname}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {FIELDS.map((field) => {
            const input = INPUTS[field];
            const id = `account-${field}`;
            const error = errors[field]?.message;
            return (
              <FormField key={field} id={id} label={input.label} required={input.required} error={error}>
                <Input
                  id={id}
                  type="text"
                  autoComplete={input.autoComplete}
                  aria-required={input.required || undefined}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                  {...register(field)}
                />
              </FormField>
            );
          })}
          <FormMessage message={errors.root?.message} />
          <Button
            type="submit"
            size="lg"
            disabled={!changed || !filled || isSubmitting}
            aria-busy={isSubmitting}
            className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
          >
            {isSubmitting && <LoaderCircle aria-hidden className="animate-spin" />}
            {isSubmitting ? T.savePending : T.save}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
