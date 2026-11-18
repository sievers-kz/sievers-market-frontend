"use client";

import { useLayoutEffect, useRef, type ChangeEvent } from "react";

import { Input } from "@/components/ui/input";

/** Не больше 15 цифр: такие числа точно безопасные целые. */
const PRICE_MAX_DIGITS = 15;

/** «13000000» → «13 000 000» (обычные пробелы). Пустая строка остаётся пустой. */
export function formatPriceDigits(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

interface PriceInputProps {
  /** Только цифры, без пробелов: так значение уходит в URL. */
  value: string;
  onChange: (digits: string) => void;
  placeholder: string;
  "aria-label": string;
}

/**
 * Цена с пробелами по разрядам при вводе. Наружу отдаёт только цифры. Каретка после
 * переформатирования встаёт после той же по счёту цифры, что и до него.
 */
export function PriceInput({ value, onChange, placeholder, "aria-label": ariaLabel }: PriceInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const digitsBeforeCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    const input = ref.current;
    const wanted = digitsBeforeCaret.current;
    if (!input || wanted === null) return;
    digitsBeforeCaret.current = null;
    let position = 0;
    let seen = 0;
    while (position < input.value.length && seen < wanted) {
      if (/\d/.test(input.value[position])) seen += 1;
      position += 1;
    }
    input.setSelectionRange(position, position);
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value: raw, selectionStart } = event.target;
    digitsBeforeCaret.current = raw.slice(0, selectionStart ?? raw.length).replace(/\D/g, "").length;
    onChange(raw.replace(/\D/g, "").slice(0, PRICE_MAX_DIGITS));
  }

  return (
    <Input
      ref={ref}
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={formatPriceDigits(value)}
      onChange={handleChange}
    />
  );
}
