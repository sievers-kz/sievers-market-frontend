"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { createCustomer } from "@/lib/api";

import { BackButton } from "./back-button";
import { customerSchema, type CustomerValues } from "./schemas";
import { useOnboardingActions } from "./use-onboarding-actions";

const FIELDS = ["last_name", "first_name"] as const;

interface CustomerFormProps {
  initialValues?: CustomerValues;
  onBack: (values: CustomerValues) => void;
}

export function CustomerForm({ initialValues, onBack }: CustomerFormProps) {
  const { handleError, finish } = useOnboardingActions();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<CustomerValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialValues ?? { last_name: "", first_name: "" },
  });
  const pending = isSubmitting || isSubmitSuccessful;

  async function onSubmit(values: CustomerValues) {
    try {
      await createCustomer(values);
    } catch (error) {
      handleError(error, setError, { fields: FIELDS });
      return;
    }
    await finish();
  }

  return (
    <AuthCard title="Как вас зовут?">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField id="last_name" label="Фамилия" error={errors.last_name?.message}>
          <Input
            id="last_name"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.last_name)}
            aria-describedby={errors.last_name ? "last_name-error" : undefined}
            {...register("last_name")}
          />
        </FormField>
        <FormField id="first_name" label="Имя" error={errors.first_name?.message}>
          <Input
            id="first_name"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.first_name)}
            aria-describedby={errors.first_name ? "first_name-error" : undefined}
            {...register("first_name")}
          />
        </FormField>
        <FormMessage message={errors.root?.message} />
        <SubmitButton pending={pending}>Продолжить</SubmitButton>
        <BackButton disabled={pending} onClick={() => onBack(getValues())} />
      </form>
    </AuthCard>
  );
}
