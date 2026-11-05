"use client";

import { useRouter } from "next/navigation";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { getCurrentUser, isApiError, showFormError } from "@/lib/api";

interface ErrorOptions<T extends FieldValues> {
  byErrorCode?: Record<string, Path<T>>;
  fields: readonly Path<T>[];
}

export function useOnboardingActions() {
  const router = useRouter();

  /** Сессия истекла → на вход, остальные ошибки показывает форма. */
  function handleError<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    options: ErrorOptions<T>,
  ) {
    if (isApiError(error) && error.status === 401) {
      router.replace("/login?next=/onboarding");
      return;
    }
    showFormError(error, setError, options);
  }

  /**
   * Профиль уже создан, поэтому сбой этого запроса не показываем:
   * повторная отправка формы только навредит, а роль заново проверит сервер.
   */
  async function finish() {
    const user = await getCurrentUser().catch(() => undefined);
    router.replace(user === null ? "/login" : "/");
    router.refresh();
  }

  return { handleError, finish };
}
