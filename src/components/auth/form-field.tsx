import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  /** Звёздочка у обязательного поля. */
  required?: boolean;
  /** Подсказка под полем; поле ссылается на неё через `aria-describedby={`${id}-hint`}`. */
  hint?: string;
  children: ReactNode;
}

/** Подпись и ошибка поля. Само поле ссылается на ошибку через `aria-describedby={`${id}-error`}`. */
export function FormField({ id, label, error, required, hint, children }: FormFieldProps) {
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
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
