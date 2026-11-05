import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { isApiError, type ApiError } from "./error";

const GENERIC_ERROR_MESSAGE = "Что-то пошло не так, попробуйте позже";

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
    setError(field as Path<T>, { type: "server", message }, { shouldFocus: !applied });
    applied = true;
  }

  const mapped = error.errorCode ? byErrorCode[error.errorCode] : undefined;
  if (mapped) {
    setError(mapped, { type: "server", message: error.message }, { shouldFocus: !applied });
    applied = true;
  }

  return applied;
}

/**
 * Показывает любую ошибку запроса в форме: по полям, если это возможно, иначе сообщением формы.
 * Текст сервера показываем только для ошибок клиента; 5xx и сбой сети дают общее сообщение.
 */
export function showFormError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  options?: MapOptions<T>,
): void {
  if (isApiError(error) && applyApiErrorToForm(error, setError, options)) return;

  const message =
    isApiError(error) && error.status < 500 ? error.message : GENERIC_ERROR_MESSAGE;
  setError("root", { type: "server", message });
}
