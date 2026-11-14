/** Вход с возвратом на `next` (401 после refresh). */
export function getLoginPath(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

/** Куда отправлять гостя и пользователя с истёкшей сессией со списка организаций. */
export const ORGANIZATIONS_LOGIN_PATH = getLoginPath("/account/organizations");
