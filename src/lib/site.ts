/** Публичный адрес сайта. Нужен для canonical, Open Graph и sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://market.sievers.kz";

export const SITE_NAME = "Sievers Market";

export const SITE_DESCRIPTION =
  "Покупайте и продавайте сельхозтехнику, оборудование и другие товары для агробизнеса напрямую у организаций по всему Казахстану";

/**
 * Картинка для ссылок в соцсетях (`src/app/opengraph-image.png`, 1200×630). Файл подхватывается сам
 * на страницах без своего `openGraph`; страница, которая задаёт `openGraph` целиком, теряет её и
 * должна указать `images: [OG_IMAGE]` явно.
 */
export const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Sievers Market — маркетплейс сельхозтехники и оборудования для агробизнеса Казахстана",
};

/**
 * Индексировать можно только production-сборку Vercel. Staging (`test.market`) и preview
 * собираются как `preview`, локально `VERCEL_ENV` не задан: везде закрываем от поисковиков.
 */
export function isIndexable(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/** Контакты в футере сайта. */
export const CONTACT_TELEGRAM_URL = "https://t.me/asynciox";
export const CONTACT_TELEGRAM_LABEL = "@asynciox";
export const CONTACT_EMAIL = "iam.bissenov@gmail.com";
