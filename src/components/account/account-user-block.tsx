"use client";

import { getAvatarInitials, getDisplayName } from "@/components/layout/user-display";
import { useHeaderUser } from "@/components/layout/header-user-provider";
import { Skeleton } from "@/components/ui/skeleton";

/** Как в меню аватара шапки, когда ФИО не задано. */
const FALLBACK_NAME = "Пользователь";

/**
 * Аватар, «Фамилия Имя» (или «Пользователь») и почта вверху сайдбара (только `lg+`).
 * Своего запроса нет: пользователь из `HeaderUserProvider` (layout `(site)`), поэтому
 * после правки на странице «Аккаунт» блок обновляется вместе с шапкой.
 * Гостя и ошибку провайдер сводит к `null`: блок не показываем, вход проверяет страница.
 */
export function AccountUserBlock() {
  const { state } = useHeaderUser();

  const user = state.status === "ready" ? state.user : null;
  if (state.status === "ready" && !user) return null;

  const displayName = user ? (getDisplayName(user) ?? FALLBACK_NAME) : "";

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
            <p title={displayName} className="truncate font-semibold">
              {displayName}
            </p>
            <p title={user.email} className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
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
