import type { ReactNode } from "react";

import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Провайдер пользователя оборачивает шапку и страницы: блок аккаунта в кабинете
 * читает тот же контекст, а страница «Аккаунт» обновляет его после правки.
 * Футер только у страниц сайта: вход и регистрация (`(auth)`) без него.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteChrome>
      {children}
      <SiteFooter />
    </SiteChrome>
  );
}
