import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ACCOUNT_TEXT } from "./account-labels";

const T = ACCOUNT_TEXT;

interface AccountFieldRowProps {
  label: string;
  /** Пустое значение: «Не указано» и кнопка «Заполнить». */
  value: string | null;
  /** Получает саму кнопку, чтобы диалог вернул на неё фокус. */
  onEdit: (trigger: HTMLButtonElement) => void;
}

/**
 * Строка «подпись / значение / Изменить» страницы «Аккаунт». Как `OrganizationFieldRow`,
 * но значение в одну строку с обрезкой (полный текст в `title`) и без звёздочки.
 */
export function AccountFieldRow({ label, value, onEdit }: AccountFieldRowProps) {
  const empty = !value;
  const action = empty ? T.fill : T.edit;

  return (
    <div className="flex items-center gap-4 border-b border-border py-4 last:border-b-0">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p
          title={value ?? undefined}
          className={cn("truncate text-base", empty && "text-muted-foreground")}
        >
          {value ?? T.empty}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        aria-label={`${action}: ${label}`}
        onClick={(event) => onEdit(event.currentTarget)}
        className="shrink-0 text-primary hover:text-primary"
      >
        {action}
      </Button>
    </div>
  );
}
