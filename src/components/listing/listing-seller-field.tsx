import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ListingSellerFieldProps {
  label: string;
  children: ReactNode;
  /** Справа от значения (кнопка «Копировать»). */
  action?: ReactNode;
  /** Юрданные: 14px обычным начертанием. Без него (контакты): 16px `font-medium`. */
  secondary?: boolean;
}

/** Поле карточки продавца: подпись сверху, значение снизу. */
export function ListingSellerField({
  label,
  children,
  action,
  secondary = false,
}: ListingSellerFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={cn("flex items-center gap-2", !secondary && "min-h-6")}>
        <span
          className={cn("min-w-0 flex-1 break-words", secondary ? "text-sm" : "font-medium")}
        >
          {children}
        </span>
        {action}
      </dd>
    </div>
  );
}
