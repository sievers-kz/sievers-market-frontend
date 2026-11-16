"use client";

import { LoaderCircle } from "lucide-react";
import type { RefObject } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MY_LISTING_ACTION_TEXT, MY_LISTINGS_TEXT } from "./my-listings-labels";
import { returnFocusTo } from "./return-focus";

interface DeleteListingDialogProps {
  /** Открывается пунктом «Удалить» в меню «⋯» карточки. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Идёт запрос удаления: кнопки отключены, закрыть нельзя. */
  pending: boolean;
  /** Запрос делает список; ошибки он же показывает над списком. */
  onConfirm: () => void;
  /** Кнопка «⋯», открывшая меню: после закрытия фокус возвращается на неё. */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/** Подтверждение удаления объявления; открывается снаружи (меню «⋯» карточки). */
export function DeleteListingDialog({
  open,
  onOpenChange,
  pending,
  onConfirm,
  returnFocusRef,
}: DeleteListingDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) onOpenChange(next);
      }}
    >
      <AlertDialogContent onCloseAutoFocus={returnFocusTo(returnFocusRef)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{MY_LISTINGS_TEXT.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{MY_LISTINGS_TEXT.deleteDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{MY_LISTINGS_TEXT.deleteCancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            aria-busy={pending}
            onClick={(event) => {
              // Закрываем сами, когда придёт ответ.
              event.preventDefault();
              onConfirm();
            }}
          >
            {pending && <LoaderCircle aria-hidden className="animate-spin" />}
            {pending ? MY_LISTINGS_TEXT.deletePending : MY_LISTING_ACTION_TEXT.delete.label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
