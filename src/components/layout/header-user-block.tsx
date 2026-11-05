"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser, type CurrentUser } from "@/lib/api";

import { GuestActions } from "./guest-actions";
import { NoRoleActions } from "./no-role-actions";
import { UserMenu } from "./user-menu";

type State = { status: "loading" } | { status: "ready"; user: CurrentUser | null };

/**
 * Блок пользователя читает сессию в браузере, а не на сервере: `cookies()` в layout
 * без Cache Components делает весь маршрут динамическим. Заодно в браузере работает
 * refresh токена, и после истечения access-cookie шапка не показывает гостя.
 */
export function HeaderUserBlock() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    getCurrentUser()
      // 401 даёт null; прочие ошибки тоже считаем гостем, чтобы не ломать шапку.
      .catch(() => null)
      .then((user) => {
        if (active) setState({ status: "ready", user });
      });
    return () => {
      active = false;
    };
  }, []);

  const showGuest = () => setState({ status: "ready", user: null });

  if (state.status === "loading") {
    return <Skeleton aria-hidden className="h-10 w-24 rounded-md bg-muted md:w-64" />;
  }

  const { user } = state;
  if (user === null) return <GuestActions />;
  if (user.role === null) return <NoRoleActions onLoggedOut={showGuest} />;
  return <UserMenu user={user} onLoggedOut={showGuest} />;
}
