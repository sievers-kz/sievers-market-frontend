/**
 * Сообщения над формой входа по `?reason=`. Значение из адреса на экран не выводим:
 * только текст из словаря, неизвестный `reason` игнорируется.
 */
const LOGIN_REASON_MESSAGES: Record<string, string> = {
  "password-changed": "Пароль изменён. Войдите с новым паролем.",
};

export function getLoginReasonMessage(reason: unknown): string | null {
  if (typeof reason !== "string" || !Object.hasOwn(LOGIN_REASON_MESSAGES, reason)) {
    return null;
  }
  return LOGIN_REASON_MESSAGES[reason];
}
