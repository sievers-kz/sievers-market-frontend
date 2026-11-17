import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  // Часть путей API оканчивается на слэш (POST /api/v1/iam/). Без этого флага Next отвечает 308
  // и убирает слэш, а FastAPI перенаправляет обратно уже на адрес бэкенда, минуя прокси.
  skipTrailingSlashRedirect: true,
  // Прокси API: cookie сессии живут на домене фронтенда и доходят до сервера Next.
  // Префикс ровно /api/v1: refresh-cookie стоит с Path=/api/v1/iam.
  // Одно правило с regex-параметром: путь уходит на бэкенд как есть, со слэшем на конце или без.
  // Раньше было два правила (с `/` и без), и первое срабатывало на оба вида путей и
  // дописывало слэш: FastAPI отвечал 307 на `/iam/login/` с Location на http://.
  rewrites() {
    return [{ source: "/api/v1/:path(.*)", destination: `${backendUrl}/api/v1/:path` }];
  },
  images: {
    // Картинки объявлений отдаёт API (см. getMediaUrl); редиректы на хранилище оптимизатор проходит сам.
    remotePatterns: [new URL(`${apiUrl}/api/v1/media/**`)],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
