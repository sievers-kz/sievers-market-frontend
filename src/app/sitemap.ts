import type { MetadataRoute } from "next";

import { getCategoryTree, getListingsCatalog } from "@/lib/api";
import { SITE_URL, isIndexable } from "@/lib/site";

/** Карту сайта пересобираем раз в час: объявления появляются и закрываются. */
export const revalidate = 3600;

const LISTINGS_PAGE_SIZE = 12;
/** Страховка: на одну категорию не больше такого числа страниц объявлений. */
const MAX_LISTING_PAGES_PER_CATEGORY = 50;

type SitemapEntry = MetadataRoute.Sitemap[number];

async function getListingEntries(categoryId: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  for (let page = 1; page <= MAX_LISTING_PAGES_PER_CATEGORY; page += 1) {
    const result = await getListingsCatalog(
      { category_id: categoryId, page, limit: LISTINGS_PAGE_SIZE },
      { forwardCookies: false, next: { revalidate } },
    );
    for (const item of result.items) {
      entries.push({ url: `${SITE_URL}/listing/${item.id}` });
    }
    if (page >= result.pages) break;
  }
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Закрытые от индексации сборки отдают пустую карту.
  if (!isIndexable()) return [];

  const entries: SitemapEntry[] = [
    { url: SITE_URL },
    { url: `${SITE_URL}/organizations` },
    { url: `${SITE_URL}/about` },
  ];

  try {
    const tree = await getCategoryTree();
    const categories = tree.flatMap((rubric) => rubric.categories);

    for (const category of categories) {
      entries.push({ url: `${SITE_URL}/catalog/${category.id}` });
    }

    // Сбой API не должен ронять сборку: отдадим то, что успели собрать.
    const listings = await Promise.allSettled(
      categories.map((category) => getListingEntries(category.id)),
    );
    for (const result of listings) {
      if (result.status === "fulfilled") entries.push(...result.value);
    }
  } catch {
    // Остаются главная и уже добавленные адреса.
  }

  return entries;
}
