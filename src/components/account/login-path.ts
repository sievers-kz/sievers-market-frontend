/** Куда отправлять гостя и пользователя с истёкшей сессией (401 после refresh). */
export const ORGANIZATIONS_LOGIN_PATH = `/login?next=${encodeURIComponent("/account/organizations")}`;
