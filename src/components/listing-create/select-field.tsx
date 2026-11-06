"use client";

import type { Ref } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Radix Select не принимает пустую строку как значение пункта. */
const NONE = "__none__";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: readonly SelectOption[];
  placeholder?: string;
  /** Пункт «Не указано» для необязательных полей: позволяет снять выбор. */
  allowEmpty?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  triggerRef?: Ref<HTMLButtonElement>;
}

/** Выбор из списка; пустая строка значит «ничего не выбрано». */
export function SelectField({
  id,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Выберите",
  allowEmpty = false,
  disabled,
  invalid,
  describedBy,
  triggerRef,
}: SelectFieldProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next === NONE ? "" : next)}
      onOpenChange={(open) => {
        if (!open) onBlur?.();
      }}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        ref={triggerRef}
        className="w-full"
        aria-invalid={invalid}
        aria-describedby={describedBy}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        {allowEmpty && <SelectItem value={NONE}>Не указано</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
