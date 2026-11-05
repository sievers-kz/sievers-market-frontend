import { apiFetch } from "./client";
import { isApiError } from "./error";
import type { components, operations } from "./schema";

type Schemas = components["schemas"];
type MeResponse =
  operations["getMe"]["responses"][200]["content"]["application/json"];

/** `role: null` значит, что онбординг не пройден. */
export type CurrentUser =
  | Schemas["CustomerMeResponse"]
  | Schemas["VendorMeResponse"]
  | { role: null };

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

export function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/api/v1/iam/me", { cache: "no-store" });
}

/**
 * Единая точка получения пользователя; `null`, если сессии нет.
 * На сервере токен не обновляется: Server Component не может ставить cookie.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const me = await getMe();
    // На проводе `role: null`, в сгенерированных типах "None" (backend#204).
    if (me.role === "None" || (me.role as string | null) === null) {
      return { role: null };
    }
    return me;
  } catch (error) {
    if (isApiError(error) && error.status === 401) return null;
    throw error;
  }
}
