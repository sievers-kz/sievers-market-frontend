/** Публичный адрес сайта. Нужен для canonical, Open Graph и sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://market.sievers.kz";

export const SITE_NAME = "Sievers Market";

export const SITE_DESCRIPTION =
  "Маркетплейс сельскохозяйственной техники и оборудования в Казахстане";

/**
 * Индексировать можно только production-сборку Vercel. Staging (`test.market`) и preview
 * собираются как `preview`, локально `VERCEL_ENV` не задан: везде закрываем от поисковиков.
 */
export function isIndexable(): boolean {
  return process.env.VERCEL_ENV === "production";
}
