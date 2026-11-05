"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { ERROR_CODES, verifyTaxpayer, type Taxpayer } from "@/lib/api";

import { BackButton } from "./back-button";
import { taxIdSchema, type TaxIdValues } from "./schemas";
import { SELLER_TYPES, type SellerType } from "./seller-types";
import { useOnboardingActions } from "./use-onboarding-actions";

const FIELDS = ["tax_id"] as const;
const BY_ERROR_CODE = {
  [ERROR_CODES.taxpayerNotFound]: "tax_id",
  [ERROR_CODES.taxpayerOnLiquidation]: "tax_id",
} as const;

interface TaxIdStepProps {
  sellerType: SellerType;
  initialValue: string;
  /** Ошибка номера от `createVendor`: пользователь вернулся сюда с шага создания. */
  serverError?: string;
  onVerified: (taxId: string, taxpayer: Taxpayer) => void;
  onBack: (taxId: string) => void;
}

export function TaxIdStep({
  sellerType,
  initialValue,
  serverError,
  onVerified,
  onBack,
}: TaxIdStepProps) {
  const { taxIdLabel, legalForm } = SELLER_TYPES[sellerType];
  const { handleError } = useOnboardingActions();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TaxIdValues>({
    resolver: zodResolver(taxIdSchema),
    defaultValues: { tax_id: initialValue },
  });

  useEffect(() => {
    if (serverError) {
      setError("tax_id", { type: "server", message: serverError }, { shouldFocus: true });
    }
  }, [serverError, setError]);

  async function onSubmit({ tax_id }: TaxIdValues) {
    try {
      onVerified(tax_id, await verifyTaxpayer(tax_id, legalForm));
    } catch (error) {
      handleError(error, setError, { byErrorCode: BY_ERROR_CODE, fields: FIELDS });
    }
  }

  return (
    <AuthCard title={`Введите ${taxIdLabel}`}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField id="tax_id" label={taxIdLabel} error={errors.tax_id?.message}>
          <Input
            id="tax_id"
            inputMode="numeric"
            autoComplete="off"
            maxLength={12}
            readOnly={isSubmitting}
            aria-invalid={Boolean(errors.tax_id)}
            aria-describedby={errors.tax_id ? "tax_id-error" : undefined}
            {...register("tax_id")}
          />
        </FormField>
        <FormMessage message={errors.root?.message} />
        <SubmitButton pending={isSubmitting}>Проверить</SubmitButton>
        <BackButton disabled={isSubmitting} onClick={() => onBack(getValues("tax_id"))} />
      </form>
    </AuthCard>
  );
}
