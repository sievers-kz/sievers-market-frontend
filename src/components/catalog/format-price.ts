/**
 * `44 000 000 ₸`. Формат поля `currency` в API не описан: если это ISO-код (KZT),
 * форматируем через Intl, иначе выводим строку как есть.
 */
export function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${new Intl.NumberFormat("ru-RU").format(price)} ${currency}`.trim();
  }
}
