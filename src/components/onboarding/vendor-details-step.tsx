"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { createVendor, ERROR_CODES, isApiError, type Taxpayer } from "@/lib/api";

import { BackButton } from "./back-button";
import { vendorDetailsSchema, type VendorDetailsValues } from "./schemas";
import { useOnboardingActions } from "./use-onboarding-actions";

const FIELDS = ["legal_address", "contact_last_name", "contact_first_name"] as const;

interface VendorDetailsStepProps {
  taxpayer: Taxpayer;
  initialValues?: VendorDetailsValues;
  /** Номер отклонён при создании: пользователь исправляет его на шаге ввода. */
  onInvalidTaxId: (message: string, values: VendorDetailsValues) => void;
  onBack: (values: VendorDetailsValues) => void;
}

export function VendorDetailsStep({
  taxpayer,
  initialValues,
  onInvalidTaxId,
  onBack,
}: VendorDetailsStepProps) {
  const { handleError, finish } = useOnboardingActions();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<VendorDetailsValues>({
    resolver: zodResolver(vendorDetailsSchema),
    defaultValues: initialValues ?? {
      legal_address: "",
      contact_last_name: "",
      contact_first_name: "",
    },
  });
  const pending = isSubmitting || isSubmitSuccessful;

  async function onSubmit(values: VendorDetailsValues) {
    try {
      await createVendor({
        ...values,
        tax_id: taxpayer.tax_id,
        legal_name: taxpayer.legal_name,
        legal_form: taxpayer.legal_form,
      });
    } catch (error) {
      if (isApiError(error) && error.errorCode === ERROR_CODES.invalidTaxNumber) {
        onInvalidTaxId(error.message, values);
        return;
      }
      handleError(error, setError, { fields: FIELDS });
      return;
    }
    await finish();
  }

  return (
    <AuthCard title="Данные продавца" description="Юридический адрес и контактное лицо">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          id="legal_address"
          label="Юридический адрес"
          error={errors.legal_address?.message}
        >
          <Input
            id="legal_address"
            autoComplete="street-address"
            aria-invalid={Boolean(errors.legal_address)}
            aria-describedby={errors.legal_address ? "legal_address-error" : undefined}
            {...register("legal_address")}
          />
        </FormField>
        <FormField
          id="contact_last_name"
          label="Фамилия"
          error={errors.contact_last_name?.message}
        >
          <Input
            id="contact_last_name"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.contact_last_name)}
            aria-describedby={errors.contact_last_name ? "contact_last_name-error" : undefined}
            {...register("contact_last_name")}
          />
        </FormField>
        <FormField
          id="contact_first_name"
          label="Имя"
          error={errors.contact_first_name?.message}
        >
          <Input
            id="contact_first_name"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.contact_first_name)}
            aria-describedby={errors.contact_first_name ? "contact_first_name-error" : undefined}
            {...register("contact_first_name")}
          />
        </FormField>
        <FormMessage message={errors.root?.message} />
        <SubmitButton pending={pending}>Создать</SubmitButton>
        <BackButton disabled={pending} onClick={() => onBack(getValues())} />
      </form>
    </AuthCard>
  );
}
