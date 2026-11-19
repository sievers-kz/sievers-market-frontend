import type { ReactNode } from "react";

interface ListingSellerFieldProps {
  label: string;
  children: ReactNode;
  /** Справа от значения (кнопка «Копировать»). */
  action?: ReactNode;
}

/** Поле карточки продавца: подпись сверху, значение снизу. */
export function ListingSellerField({ label, children, action }: ListingSellerFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="flex min-h-6 items-center gap-2">
        <span className="min-w-0 flex-1 font-medium break-words">{children}</span>
        {action}
      </dd>
    </div>
  );
}
