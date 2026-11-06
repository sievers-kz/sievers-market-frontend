import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  /** Звёздочка у обязательного поля. */
  required?: boolean;
  children: ReactNode;
}

/** Подпись и ошибка поля. Само поле ссылается на ошибку через `aria-describedby={`${id}-error`}`. */
export function FormField({ id, label, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
