import type { MetadataRoute } from "next";

import { SITE_URL, isIndexable } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Staging и preview закрываем целиком. Личные страницы production закрыты
  // метатегом `noindex` на самих страницах: запрет в robots.txt не даёт роботу его прочитать.
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
