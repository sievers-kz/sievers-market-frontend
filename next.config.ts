import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
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
