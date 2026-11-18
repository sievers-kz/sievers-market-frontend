"use client";

import { useLayoutEffect, useRef, type ChangeEvent } from "react";

import { Input } from "@/components/ui/input";

/** Не больше 15 цифр в целой части: такие числа точно безопасные целые. */
const MAX_INTEGER_DIGITS = 15;
/** Как в разборе URL (`parseRangeBound`). */
const MAX_FRACTION_DIGITS = 6;

/** Цифры и запятая (так показан разделитель): по ним ставится каретка. */
const SIGNIFICANT_RE = /[\d,]/;

/**
 * Значение для показа: «13000000» → «13 000 000», «12.5» → «12,5» (обычные пробелы).
 * Разряды отделяются, если в целой части не меньше `groupFrom` цифр.
 */
export function formatNumberInput(value: string, groupFrom = 4): string {
  const [integer, fraction] = value.split(".");
  const grouped = integer.length >= groupFrom ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : integer;
  return fraction === undefined ? grouped : `${grouped},${fraction}`;
}

/**
 * Ввод в значение: только цифры и, если `decimal`, одна точка (запятая тоже считается
 * точкой). «,5» → «0.5». Незаконченное «12.» остаётся как есть, его отбрасывает разбор.
 */
function toNumberValue(raw: string, decimal: boolean): string {
  if (!decimal) return raw.replace(/\D/g, "").slice(0, MAX_INTEGER_DIGITS);
  const cleaned = raw.replace(/,/g, ".").replace(/[^\d.]/g, "");
  const dot = cleaned.indexOf(".");
  if (dot === -1) return cleaned.slice(0, MAX_INTEGER_DIGITS);
  const integer = cleaned.slice(0, dot).slice(0, MAX_INTEGER_DIGITS) || "0";
  const fraction = cleaned.slice(dot + 1).replace(/\./g, "").slice(0, MAX_FRACTION_DIGITS);
  return `${integer}.${fraction}`;
}

interface NumberInputProps {
  /** Цифры и, у дробных, точка, без пробелов: так значение уходит в URL. */
  value: string;
  onChange: (value: string) => void;
  /** Можно дробную часть (атрибут `float`). */
  decimal?: boolean;
  /** С какого числа цифр отделять разряды: у цены с 4 («1 000»), у атрибутов с 5 («2015»). */
  groupFrom?: number;
  placeholder: string;
  "aria-label": string;
}

/**
 * Число с пробелами по разрядам при вводе (цена, числовые атрибуты). Наружу отдаёт только
 * цифры и точку. Каретка после переформатирования встаёт после того же по счёту знака
 * (цифры или разделителя), что и до него.
 */
export function NumberInput({
  value,
  onChange,
  decimal = false,
  groupFrom = 4,
  placeholder,
  "aria-label": ariaLabel,
}: NumberInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const charsBeforeCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    const input = ref.current;
    const wanted = charsBeforeCaret.current;
    if (!input || wanted === null) return;
    charsBeforeCaret.current = null;
    let position = 0;
    let seen = 0;
    while (position < input.value.length && seen < wanted) {
      if (SIGNIFICANT_RE.test(input.value[position])) seen += 1;
      position += 1;
    }
    input.setSelectionRange(position, position);
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value: raw, selectionStart } = event.target;
    const significant = decimal ? /[\d.,]/g : /\d/g;
    charsBeforeCaret.current = raw.slice(0, selectionStart ?? raw.length).match(significant)?.length ?? 0;
    onChange(toNumberValue(raw, decimal));
  }

  return (
    <Input
      ref={ref}
      inputMode={decimal ? "decimal" : "numeric"}
      autoComplete="off"
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={formatNumberInput(value, groupFrom)}
      onChange={handleChange}
    />
  );
}
