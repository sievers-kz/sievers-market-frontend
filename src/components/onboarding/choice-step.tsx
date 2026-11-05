"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { SubmitButton } from "@/components/auth/submit-button";

import { BackButton } from "./back-button";
import { choiceSchema, type ChoiceValues } from "./schemas";
import { TileRadioGroup } from "./tile-radio-group";

interface ChoiceStepProps<T extends string> {
  title: string;
  options: readonly { value: T; label: string }[];
  initialValue?: T;
  onSelect: (value: T) => void;
  onBack?: () => void;
}

/** Выбор из двух плиток. Перехода по выбору нет: стрелки сразу меняют значение радио. */
export function ChoiceStep<T extends string>({
  title,
  options,
  initialValue,
  onSelect,
  onBack,
}: ChoiceStepProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChoiceValues>({
    resolver: zodResolver(choiceSchema),
    defaultValues: { choice: initialValue ?? "" },
  });

  return (
    <AuthCard title={title}>
      <form
        onSubmit={handleSubmit(({ choice }) => onSelect(choice as T))}
        noValidate
        className="flex flex-col gap-4"
      >
        <TileRadioGroup
          legend={title}
          options={options}
          error={errors.choice?.message}
          inputProps={register("choice")}
        />
        <SubmitButton pending={false}>Продолжить</SubmitButton>
        {onBack && <BackButton onClick={onBack} />}
      </form>
    </AuthCard>
  );
}
