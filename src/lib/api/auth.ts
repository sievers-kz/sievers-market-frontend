import { apiFetch } from "./client";
import { isApiError } from "./error";
import type { components, operations } from "./schema";

type Schemas = components["schemas"];
type CustomerMeResponse =
  operations["getCustomerMe"]["responses"][200]["content"]["application/json"];

/** Профиль аккаунта. Ролей нет: объявления подаются от имени организаций. */
export type CurrentUser = CustomerMeResponse;

export async function createNewUser(
  body: Schemas["CreateAccountRequest"],
): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/", { method: "POST", body });
}

/** Ставит cookie сессии. Тело ответа намеренно не возвращаем. */
export async function confirmAccount(
  body: Schemas["AccountConfirmation"],
): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/account/confirm", { method: "POST", body });
}

export async function resendConfirmationCode(
  body: Schemas["ResendCodeRequest"],
): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/code/resend", { method: "POST", body });
}

/** Ставит cookie сессии. Тело ответа намеренно не возвращаем. */
export async function loginUser(body: Schemas["LoginAccount"]): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/login", { method: "POST", body });
}

export async function logoutUser(): Promise<void> {
  await apiFetch<unknown>("/api/v1/iam/logout", { method: "POST" });
}

/** Если профиля ещё нет, бэкенд создаёт его при первом обращении. */
export function getCustomerMe(): Promise<CustomerMeResponse> {
  return apiFetch<CustomerMeResponse>("/api/v1/customer/me", { cache: "no-store" });
}

/**
 * Единая точка получения пользователя; `null`, если сессии нет.
 * На сервере токен не обновляется: Server Component не может ставить cookie.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await getCustomerMe();
  } catch (error) {
    if (isApiError(error) && error.status === 401) return null;
    throw error;
  }
}
