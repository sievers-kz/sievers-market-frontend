"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import type { Ref } from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { CONFIRM_CODE_LENGTH } from "./schemas";

interface ConfirmCodeInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef: Ref<HTMLInputElement>;
  invalid: boolean;
  /** id текста ошибки под ячейками. */
  errorId: string;
  autoFocus?: boolean;
}

/** Ячейки кода из письма: регистрация и смена почты и пароля. Подпись и ошибку рисует форма. */
export function ConfirmCodeInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
  errorId,
  autoFocus = true,
}: ConfirmCodeInputProps) {
  return (
    <InputOTP
      id={id}
      ref={inputRef}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      maxLength={CONFIRM_CODE_LENGTH}
      pattern={REGEXP_ONLY_DIGITS}
      inputMode="numeric"
      autoComplete="one-time-code"
      autoFocus={autoFocus}
      aria-invalid={invalid}
      aria-describedby={invalid ? errorId : undefined}
    >
      <InputOTPGroup>
        {Array.from({ length: CONFIRM_CODE_LENGTH }, (_, index) => (
          <InputOTPSlot key={index} index={index} aria-invalid={invalid} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
