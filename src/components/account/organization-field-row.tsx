import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ORGANIZATION_DETAIL_TEXT } from "./organization-labels";

const T = ORGANIZATION_DETAIL_TEXT;

interface OrganizationFieldRowProps {
  label: string;
  value: string | null | undefined;
  /** Что показать вместо пустого значения: «Не указано» или «Появится после проверки». */
  emptyText?: string;
  /** Звёздочка: поле нужно для публикации объявлений. */
  required?: boolean;
  /** Есть только у полей магазина: «Изменить», у пустого значения «Заполнить». */
  /** Получает саму кнопку, чтобы диалог вернул на неё фокус. */
  onEdit?: (trigger: HTMLButtonElement) => void;
}

/** Строка «подпись / значение / кнопка»; разделитель между строками, у последней его нет. */
export function OrganizationFieldRow({
  label,
  value,
  emptyText = T.empty,
  required = false,
  onEdit,
}: OrganizationFieldRowProps) {
  const empty = !value;
  const action = empty ? T.fill : T.edit;
  const ariaLabel = `${action}: ${label}${required ? `, ${T.required}` : ""}`;

  return (
    <div className="flex items-center gap-4 border-b border-border py-4 last:border-b-0">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {label}
          {required && (
            <span aria-hidden className="text-destructive">
              {" *"}
            </span>
          )}
        </p>
        <p className={cn("text-base break-words", empty && "text-muted-foreground")}>
          {empty ? emptyText : value}
        </p>
      </div>
      {onEdit && (
        <Button
          type="button"
          variant="ghost"
          aria-label={ariaLabel}
          onClick={(event) => onEdit(event.currentTarget)}
          className="shrink-0 text-primary hover:text-primary"
        >
          {action}
        </Button>
      )}
    </div>
  );
}
