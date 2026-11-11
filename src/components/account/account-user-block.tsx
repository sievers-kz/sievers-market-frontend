"use client";

import { useEffect, useState } from "react";

import { getAvatarInitials, getDisplayName } from "@/components/layout/user-display";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser, type CurrentUser } from "@/lib/api";

type UserState = { status: "loading" } | { status: "ready"; user: CurrentUser | null };

/**
 * Аватар, «Фамилия Имя» и почта вверху сайдбара (только `lg+`).
 * Свой запрос: `HeaderUserProvider` оборачивает только шапку, каркасу его контекст недоступен.
 * Ошибки считаем гостем (`null`): блок не показываем, вход проверяет сама страница.
 */
export function AccountUserBlock() {
  const [state, setState] = useState<UserState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .catch(() => null)
      .then((user) => {
        if (active) setState({ status: "ready", user });
      });
    return () => {
      active = false;
    };
  }, []);

  const user = state.status === "ready" ? state.user : null;
  if (state.status === "ready" && !user) return null;

  const displayName = user ? getDisplayName(user) : null;

  return (
    <div className="mb-4 hidden h-16 items-center gap-4 border-b border-border pb-4 lg:flex">
      {user ? (
        <>
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground"
          >
            {getAvatarInitials(user)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            {displayName && <p className="truncate font-semibold">{displayName}</p>}
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
        </>
      ) : (
        <>
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </>
      )}
    </div>
  );
}
