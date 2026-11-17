const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Цвет для образца в списке. Справочник присылает `#367C2B` (с `#`, в верхнем регистре),
 * но схема это просто строка: принимаем 3 или 6 hex-цифр с `#` или без.
 * Пустое и неверное значение даёт `undefined`, и образец не рисуется.
 */
export function parseHexColor(value: string | null | undefined): string | undefined {
  const match = value?.trim().match(HEX);
  return match ? `#${match[1].toLowerCase()}` : undefined;
}
