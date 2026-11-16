"use client";

import { Archive, Ellipsis, Eye, EyeOff, LoaderCircle, Trash2, type LucideIcon } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ListingStatusAction, MyListingsStatus } from "@/lib/api";

import { DeleteListingDialog } from "./delete-listing-dialog";
import {
  MY_LISTING_ACTION_TEXT,
  MY_LISTING_STATUS_ACTIONS,
  MY_LISTINGS_TEXT,
} from "./my-listings-labels";

const ACTION_ICONS: Record<Exclude<ListingStatusAction, "delete">, LucideIcon> = {
  activate: Eye,
  deactivate: EyeOff,
  archive: Archive,
};

const OPEN_KEYS = new Set(["Enter", " ", "ArrowDown"]);

interface MyListingActionsMenuProps {
  status: MyListingsStatus;
  /** Идёт другое действие или перечитывание списка: меню не открывается. */
  disabled: boolean;
  /** Идёт действие над этим объявлением. */
  busy: boolean;
  /** Запрос и его итог (сообщение, перечитывание) на стороне списка; не бросает. */
  onAction: (action: ListingStatusAction) => Promise<void>;
}

/**
 * Меню «⋯» карточки «Моих объявлений». Пункты зависят от статуса, «Удалить» последним
 * и через подтверждение. Кнопка на время запроса не `disabled`, а `aria-disabled` (меню не
 * открывается): так фокус не слетает на `body` после закрытия меню, а подпись остаётся.
 */
export function MyListingActionsMenu({ status, disabled, busy, onAction }: MyListingActionsMenuProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inactive = disabled || busy;

  // Radix открывает меню по `pointerdown` и Enter / пробелу / стрелке вниз, если событие
  // не отменено. Остальные клавиши (Tab) не трогаем.
  const blockPointer = (event: SyntheticEvent) => {
    if (inactive) event.preventDefault();
  };
  const blockOpenKeys = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (inactive && OPEN_KEYS.has(event.key)) event.preventDefault();
  };

  async function handleDelete() {
    await onAction("delete");
    setDeleteOpen(false);
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={MY_LISTINGS_TEXT.actions}
            aria-disabled={inactive || undefined}
            aria-busy={busy || undefined}
            onPointerDown={blockPointer}
            onKeyDown={blockOpenKeys}
            className="bg-card text-muted-foreground aria-disabled:opacity-50 sm:bg-transparent"
          >
            {busy ? <LoaderCircle aria-hidden className="animate-spin" /> : <Ellipsis aria-hidden />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {MY_LISTING_STATUS_ACTIONS[status].map((action) => {
            const Icon = ACTION_ICONS[action];
            return (
              <DropdownMenuItem key={action} onSelect={() => void onAction(action)}>
                <Icon aria-hidden />
                {MY_LISTING_ACTION_TEXT[action].label}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 aria-hidden />
            {MY_LISTING_ACTION_TEXT.delete.label}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteListingDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        pending={busy}
        onConfirm={() => void handleDelete()}
        returnFocusRef={triggerRef}
      />
    </>
  );
}
