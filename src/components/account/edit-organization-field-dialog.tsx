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
import {
  changeOrganizationContactEmail,
  changeOrganizationContactPhone,
  changeOrganizationShopName,
  ERROR_CODES,
  isApiError,
  showFormError,
} from "@/lib/api";

import { getShopFieldSchema, type ShopFieldValues } from "./organization-edit-schema";
import { ORGANIZATION_DETAIL_TEXT, SHOP_FIELD_LABELS, type ShopField } from "./organization-labels";
import { returnFocusTo } from "./return-focus";

const T = ORGANIZATION_DETAIL_TEXT;

const INPUTS: Record<ShopField, React.ComponentProps<typeof Input>> = {
  shop_name: { type: "text", autoComplete: "organization" },
  contact_phone: { type: "tel", inputMode: "tel", autoComplete: "tel" },
  contact_email: { type: "email", inputMode: "email", autoComplete: "email" },
};

const SAVE: Record<ShopField, (organizationId: string, value: string) => Promise<void>> = {
  shop_name: (id, value) => changeOrganizationShopName(id, { shop_name: value }),
  contact_phone: (id, value) => changeOrganizationContactPhone(id, { contact_phone: value }),
  contact_email: (id, value) => changeOrganizationContactEmail(id, { contact_email: value }),
};

/** Бизнес-ошибки, которые относятся к полю, а не к форме. */
const BY_ERROR_CODE = {
  [ERROR_CODES.invalidShopName]: "value",
  [ERROR_CODES.invalidPhoneFormat]: "value",
} as const;

interface EditOrganizationFieldDialogProps {
  organizationId: string;
  field: ShopField;
  /** Текущее значение: поле открывается заполненным. */
  initialValue: string | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 200: значение, ушедшее на бэкенд (после схлопывания пробелов). */
  onSaved: (field: ShopField, value: string) => void;
  /** 404 `organization_not_found_error`. */
  onNotFound: () => void;
  loginPath: string;
  /** Кнопка «Изменить» / «Заполнить», открывшая диалог. */
  returnFocusRef: RefObject<HTMLElement | null>;
}

/**
 * Правка одного поля магазина. Форма создаётся заново на каждое открытие
 * (родитель меняет `key`), поэтому значение по умолчанию всегда текущее.
 */
export function EditOrganizationFieldDialog({
  organizationId,
  field,
  initialValue,
  open,
  onOpenChange,
  onSaved,
  onNotFound,
  loginPath,
  returnFocusRef,
}: EditOrganizationFieldDialogProps) {
  const router = useRouter();
  const initial = initialValue ?? "";
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ShopFieldValues>({
    resolver: zodResolver(getShopFieldSchema(field)),
    defaultValues: { value: initial },
  });

  const value = useWatch({ control, name: "value" }) ?? "";
  const ready = value.trim() !== "" && value.trim() !== initial.trim();
  const inputId = `organization-${field}`;
  const label = SHOP_FIELD_LABELS[field];

  async function onSubmit({ value: next }: ShopFieldValues) {
    try {
      await SAVE[field](organizationId, next);
      onOpenChange(false);
      onSaved(field, next);
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        router.replace(loginPath);
        return;
      }
      if (isApiError(error) && error.status === 404) {
        onOpenChange(false);
        onNotFound();
        return;
      }
      showFormError(error, setError, {
        byErrorCode: BY_ERROR_CODE,
        // 422 Pydantic приходит с `loc: [body, <поле>]`: в форме это `value`.
        resolveField: (fieldError) => (fieldError.field === field ? "value" : undefined),
      });
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
      {/* Описания у диалога нет: заголовок и подпись поля говорят всё. */}
      <DialogContent aria-describedby={undefined} onCloseAutoFocus={returnFocusTo(returnFocusRef)}>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FormField id={inputId} label={label} required error={errors.value?.message}>
            <Input
              id={inputId}
              {...INPUTS[field]}
              aria-required
              aria-invalid={Boolean(errors.value)}
              aria-describedby={errors.value ? `${inputId}-error` : undefined}
              {...register("value")}
            />
          </FormField>
          <FormMessage message={errors.root?.message} />
          <Button
            type="submit"
            size="lg"
            disabled={!ready || isSubmitting}
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
