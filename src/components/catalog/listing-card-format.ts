/**
 * Подписи и форматы для карточки объявления в каталоге (`docs/pages/catalog-card.md`).
 */

/** Ключи варианта атрибута «Состояние». Подписи с бэкенда для карточки не приходят. */
const CONDITION_LABELS = {
  new: "Новый",
  used: "Б/У",
} as const;

export type ListingCondition = keyof typeof CONDITION_LABELS;

/** `Object.hasOwn`, а не `in`: ключи вроде `__proto__` или `toString` подписи не дают. */
export function isListingCondition(value: string | null | undefined): value is ListingCondition {
  return typeof value === "string" && Object.hasOwn(CONDITION_LABELS, value);
}

/** «Новый» / «Б/У»; для `null`, пустой строки и неизвестного ключа `null` (тега нет). */
export function getConditionLabel(condition: string | null | undefined): string | null {
  return isListingCondition(condition) ? CONDITION_LABELS[condition] : null;
}

/**
 * Часовой пояс задан явно: сервер работает в UTC, браузер в поясе пользователя,
 * без него одна и та же дата на границе суток выглядела бы по-разному.
 */
const TIME_ZONE = "Asia/Almaty";

const dayMonthFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  timeZone: TIME_ZONE,
});

const dayMonthYearFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const yearFormat = new Intl.DateTimeFormat("ru-RU", { year: "numeric", timeZone: TIME_ZONE });

/**
 * `17 нояб.`; если год (в Алматы) не текущий, `2 мар. 2025 г.`. Без «сегодня» и «вчера»:
 * страница каталога кэшируется, и такие подписи устаревают. Пустая или некорректная дата: `null`.
 */
export function formatListingDate(
  value: string | null | undefined,
  now: Date = new Date(),
): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const sameYear = yearFormat.format(date) === yearFormat.format(now);
  return (sameYear ? dayMonthFormat : dayMonthYearFormat).format(date);
}
