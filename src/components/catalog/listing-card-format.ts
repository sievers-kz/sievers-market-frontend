/** Подписи состояния: ключи варианта атрибута `condition` из справочника бэкенда. */
const CONDITION_LABELS: Record<string, string> = {
  new: "Новый",
  used: "Б/У",
};

/** Подпись состояния; для неизвестного ключа (или `null`) `null`: тег не показываем. */
export function getConditionLabel(condition: string | null | undefined): string | null {
  if (!condition) return null;
  return Object.hasOwn(CONDITION_LABELS, condition) ? CONDITION_LABELS[condition] : null;
}

const TIME_ZONE = "Asia/Almaty";

/**
 * Дата публикации: `17 нояб.`, для другого года `17 нояб. 2025 г.`.
 * Без «сегодня/вчера»: страница каталога кэшируется, а такие слова устаревают.
 * Часовой пояс задан явно, чтобы сервер и браузер показывали одну и ту же дату.
 */
export function formatListingDate(iso: string | null | undefined, now: Date = new Date()): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const year = (value: Date) =>
    new Intl.DateTimeFormat("ru-RU", { year: "numeric", timeZone: TIME_ZONE }).format(value);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    ...(year(date) === year(now) ? {} : { year: "numeric" }),
    timeZone: TIME_ZONE,
  }).format(date);
}
