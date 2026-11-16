"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useHeaderUser } from "@/components/layout/header-user-provider";
import { Button } from "@/components/ui/button";
import { getCurrentUser, isApiError, type CurrentUser } from "@/lib/api";

import { AccountFieldRow } from "./account-field-row";
import {
  ACCOUNT_TEXT,
  formatFullname,
  formatPasswordChangedAt,
} from "./account-labels";
import { AccountPageHeader } from "./account-page-header";
import { AccountSkeleton } from "./account-skeleton";
import { ChangeEmailDialog } from "./change-email-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { EditFullnameDialog } from "./edit-fullname-dialog";
import { ACCOUNT_LOGIN_PATH, PASSWORD_CHANGED_LOGIN_PATH } from "./login-path";

const T = ACCOUNT_TEXT;

type PageState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; user: CurrentUser };

type DialogName = "fullname" | "email" | "password";

/**
 * Страница «Аккаунт». Пользователя читает сама (`getCurrentUser()` в браузере, здесь
 * работает refresh): ей нужны «ошибка» и «Повторить», а провайдер шапки сводит ошибку
 * к гостю. После правки свежий пользователь уходит в провайдер: шапка и сайдбар обновляются.
 */
export function AccountView() {
  const router = useRouter();
  const { setUser } = useHeaderUser();
  const [state, setState] = useState<PageState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [dialog, setDialog] = useState<{ name: DialogName; open: boolean; key: number }>({
    name: "fullname",
    open: false,
    key: 0,
  });

  useEffect(() => {
    let active = true;
    getCurrentUser().then(
      (user) => {
        if (!active) return;
        if (user === null) router.replace(ACCOUNT_LOGIN_PATH);
        else setState({ status: "ready", user });
      },
      () => {
        if (active) setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [attempt, router]);

  function showUser(user: CurrentUser) {
    setState({ status: "ready", user });
    setUser(user);
  }

  /** Тихое перечитывание после правки: сеть и 5xx оставляют то, что уже показано. */
  async function reload() {
    try {
      const user = await getCurrentUser();
      if (user === null) router.replace(ACCOUNT_LOGIN_PATH);
      else showUser(user);
    } catch (error) {
      if (isApiError(error) && error.status === 401) router.replace(ACCOUNT_LOGIN_PATH);
    }
  }

  /** Пока идёт перечитывание, показываем отправленные значения. */
  function patchUser(patch: Partial<CurrentUser>) {
    if (state.status !== "ready") return;
    showUser({ ...state.user, ...patch });
    void reload();
  }

  if (state.status === "loading") return <AccountSkeleton />;

  if (state.status === "error") {
    return (
      <>
        <AccountPageHeader title={T.pageTitle} />
        <div
          role="alert"
          className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center"
        >
          <p>{T.loadError}</p>
          <Button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((value) => value + 1);
            }}
          >
            {T.retry}
          </Button>
        </div>
      </>
    );
  }

  const { user } = state;
  const openDialog = (name: DialogName, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setDialog((current) => ({ name, open: true, key: current.key + 1 }));
  };
  const setDialogOpen = (open: boolean) => setDialog((current) => ({ ...current, open }));

  return (
    <>
      <AccountPageHeader title={T.pageTitle} />

      <section
        aria-labelledby="account-personal"
        className="flex flex-col rounded-2xl bg-card px-6 pt-6 pb-2"
      >
        <h2 id="account-personal" className="text-base font-semibold">
          {T.personalSection}
        </h2>
        <AccountFieldRow
          label={T.fullname}
          value={formatFullname(user)}
          onEdit={(trigger) => openDialog("fullname", trigger)}
        />
      </section>

      <section
        aria-labelledby="account-security"
        className="flex flex-col rounded-2xl bg-card px-6 pt-6 pb-2"
      >
        <h2 id="account-security" className="text-base font-semibold">
          {T.securitySection}
        </h2>
        <AccountFieldRow
          label={T.email}
          value={user.email}
          onEdit={(trigger) => openDialog("email", trigger)}
        />
        <AccountFieldRow
          label={T.password}
          value={formatPasswordChangedAt(user.password_changed_at)}
          onEdit={(trigger) => openDialog("password", trigger)}
        />
      </section>

      {dialog.name === "fullname" && (
        <EditFullnameDialog
          key={dialog.key}
          open={dialog.open}
          onOpenChange={setDialogOpen}
          returnFocusRef={triggerRef}
          user={user}
          onSaved={(fullname) => patchUser(fullname)}
        />
      )}
      {dialog.name === "email" && (
        <ChangeEmailDialog
          key={dialog.key}
          open={dialog.open}
          onOpenChange={setDialogOpen}
          returnFocusRef={triggerRef}
          currentEmail={user.email}
          onChanged={(email) => patchUser({ email })}
        />
      )}
      {dialog.name === "password" && (
        <ChangePasswordDialog
          key={dialog.key}
          open={dialog.open}
          onOpenChange={setDialogOpen}
          returnFocusRef={triggerRef}
          email={user.email}
          onChanged={() => {
            // Бэкенд уже завершил сессию и почистил cookie.
            router.replace(PASSWORD_CHANGED_LOGIN_PATH);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
