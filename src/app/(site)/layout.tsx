import type { ReactNode } from "react";

import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * Провайдер пользователя оборачивает шапку и страницы: блок аккаунта в кабинете
 * читает тот же контекст, а страница «Аккаунт» обновляет его после правки.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
