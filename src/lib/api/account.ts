import { apiFetch } from "./client";
import type { operations } from "./schema";

type ChangeFullnameRequest =
  operations["changeCustomerFullname"]["requestBody"]["content"]["application/json"];
type RequestEmailChangeRequest =
  operations["requestEmailChange"]["requestBody"]["content"]["application/json"];
type ConfirmEmailChangeRequest =
  operations["confirmEmailChange"]["requestBody"]["content"]["application/json"];
type RequestPasswordChangeRequest =
  operations["requestPasswordChange"]["requestBody"]["content"]["application/json"];
type ConfirmPasswordChangeRequest =
  operations["confirmPasswordChange"]["requestBody"]["content"]["application/json"];

/*
 * Правки аккаунта: docs/pages/account.md. Ответ 200 у всех в OpenAPI без схемы
 * (на деле `{ message }`): тело не читаем, после успеха пользователя перечитывают
 * `getCurrentUser()`. Ответы-ошибки тоже `unknown`, коды в `ERROR_CODES`.
 */

/** 422 `invalid_fullname_format_error` / `fullname_required_error` с `metadata.field`. */
export async function changeCustomerFullname(body: ChangeFullnameRequest): Promise<void> {
  await apiFetch<unknown>("/api/v1/customer/fullname/change", { method: "PATCH", body });
}

/** Код уходит на новый адрес; почта аккаунта меняется только после `confirmEmailChange`. */
export async function requestEmailChange(body: RequestEmailChangeRequest): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/email/change", { method: "PATCH", body });
}

/** 400 `invalid_otp_code_error` / `email_change_request_not_found_error`. Сессия остаётся. */
export async function confirmEmailChange(body: ConfirmEmailChangeRequest): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/email/confirm", { method: "PATCH", body });
}

/** Код уходит на текущую почту; 400 `password_mismatch_error` при неверном текущем пароле. */
export async function requestPasswordChange(
  body: RequestPasswordChangeRequest,
): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/password/change/request", { method: "PATCH", body });
}

/**
 * 400 `invalid_otp_code_error` / `password_change_request_not_found_error`.
 * После успеха бэкенд завершает сессию и чистит cookie.
 */
export async function confirmPasswordChange(
  body: ConfirmPasswordChangeRequest,
): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/password/change/confirm", { method: "PATCH", body });
}
