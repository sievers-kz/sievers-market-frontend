import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import type { ApiError } from "./error";

interface MapOptions<T extends FieldValues> {
  /** Какое поле формы подсвечивать для бизнес-ошибки (`error_code`). */
  byErrorCode?: Record<string, Path<T>>;
}

/**
 * Переносит ошибки API в состояние react-hook-form.
 * Возвращает `true`, если ошибка привязана хотя бы к одному полю;
 * иначе её нужно показать общим сообщением (toast / alert формы).
 */
export function applyApiErrorToForm<T extends FieldValues>(
  error: ApiError,
  setError: UseFormSetError<T>,
  { byErrorCode = {} }: MapOptions<T> = {},
): boolean {
  let applied = false;

  for (const { field, message } of error.fieldErrors) {
    setError(field as Path<T>, { type: "server", message });
    applied = true;
  }

  const mapped = error.errorCode ? byErrorCode[error.errorCode] : undefined;
  if (mapped) {
    setError(mapped, { type: "server", message: error.message });
    applied = true;
  }

  return applied;
}
