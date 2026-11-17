"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type RefObject } from "react";

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
import { deleteOrganization, ERROR_CODES, isApiError } from "@/lib/api";

import { ORGANIZATIONS_LOGIN_PATH } from "./login-path";
import { ORGANIZATIONS_TEXT } from "./organization-labels";
import { returnFocusTo } from "./return-focus";

interface DeleteOrganizationDialogProps {
  organizationId: string;
  /** Открывается пунктом «Удалить» в меню «⋯» карточки. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 204, а без `onNotFound` и 404: карточку убираем. */
  onDeleted: () => void;
  /** 404 отдельно от удаления (страница организации показывает «не найдена»). */
  onNotFound?: () => void;
  /** 400 `organization_cannot_be_deleted`: организацию успели подтвердить. */
  onCannotDelete: () => void;
  /** Куда вести при 401; по умолчанию вход с возвратом на список. */
  loginPath?: string;
  /** Кнопка «⋯», открывшая меню: после закрытия фокус возвращается на неё. */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/** Подтверждение удаления; открывается снаружи (меню «⋯» карточки). */
export function DeleteOrganizationDialog({
  organizationId,
  open,
  onOpenChange: setOpen,
  onDeleted,
  onNotFound = onDeleted,
  onCannotDelete,
  loginPath = ORGANIZATIONS_LOGIN_PATH,
  returnFocusRef,
}: DeleteOrganizationDialogProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setPending(true);
    setError(null);
    try {
      await deleteOrganization(organizationId);
      setOpen(false);
      onDeleted();
    } catch (err) {
      if (isApiError(err) && err.status === 404) {
        setOpen(false);
        onNotFound();
      } else if (isApiError(err) && err.errorCode === ERROR_CODES.organizationCannotBeDeleted) {
        setOpen(false);
        onCannotDelete();
      } else if (isApiError(err) && err.status === 401) {
        router.replace(loginPath);
      } else {
        setError(ORGANIZATIONS_TEXT.deleteFailed);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <AlertDialogContent onCloseAutoFocus={returnFocusTo(returnFocusRef)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{ORGANIZATIONS_TEXT.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{ORGANIZATIONS_TEXT.deleteDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{ORGANIZATIONS_TEXT.deleteCancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            aria-busy={pending}
            onClick={(event) => {
              // Закрываем сами, когда придёт ответ.
              event.preventDefault();
              void handleDelete();
            }}
          >
            {pending && <LoaderCircle aria-hidden className="animate-spin" />}
            {pending ? ORGANIZATIONS_TEXT.deletePending : ORGANIZATIONS_TEXT.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
