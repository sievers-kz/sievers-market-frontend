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
  /** Цвет образца перед названием (уже проверенный hex). */
  swatch?: string;
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
          // Образец внутри ItemText: Radix повторяет его и в выбранном значении.
          <SelectItem key={option.value} value={option.value}>
            {option.swatch && (
              <span
                aria-hidden
                className="size-4 shrink-0 rounded-sm border border-foreground/20"
                style={{ backgroundColor: option.swatch }}
              />
            )}
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
