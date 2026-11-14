"use client";

import { Ellipsis, RotateCw, Trash2 } from "lucide-react";
import type { Ref } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ORGANIZATIONS_TEXT } from "./organization-labels";

/**
 * Меню «⋯» карточки организации: «Удалить» и, если опрос статуса остановился,
 * «Проверить снова». Для `verified` не рендерится.
 */
export function OrganizationActionsMenu({
  onDelete,
  onPollAgain,
  triggerRef,
}: {
  onDelete: () => void;
  /** Кнопка «⋯»: на неё диалог удаления возвращает фокус. */
  triggerRef?: Ref<HTMLButtonElement>;
  /** Есть только когда опрос остановился после 40 попыток. */
  onPollAgain?: () => void;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="ghost"
          size="icon"
          aria-label={ORGANIZATIONS_TEXT.actions}
          className="size-8 shrink-0 text-muted-foreground"
        >
          <Ellipsis aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onPollAgain && (
          <DropdownMenuItem onSelect={onPollAgain}>
            <RotateCw aria-hidden />
            {ORGANIZATIONS_TEXT.pollAgain}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2 aria-hidden />
          {ORGANIZATIONS_TEXT.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
