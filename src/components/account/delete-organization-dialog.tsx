"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteOrganization, ERROR_CODES, isApiError } from "@/lib/api";

import { ORGANIZATIONS_LOGIN_PATH } from "./login-path";
import { ORGANIZATIONS_TEXT } from "./organization-labels";

interface DeleteOrganizationDialogProps {
  organizationId: string;
  /** 204 или 404: карточку убираем. */
  onDeleted: () => void;
  /** 400 `organization_cannot_be_deleted`: организацию успели подтвердить. */
  onCannotDelete: () => void;
}

/** Кнопка «Удалить» с подтверждением. */
export function DeleteOrganizationDialog({
  organizationId,
  onDeleted,
  onCannotDelete,
}: DeleteOrganizationDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
        onDeleted();
      } else if (isApiError(err) && err.errorCode === ERROR_CODES.organizationCannotBeDeleted) {
        setOpen(false);
        onCannotDelete();
      } else if (isApiError(err) && err.status === 401) {
        router.replace(ORGANIZATIONS_LOGIN_PATH);
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
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="self-start px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 aria-hidden />
          {ORGANIZATIONS_TEXT.delete}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
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
