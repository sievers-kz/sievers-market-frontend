import type { ReactNode } from "react";

import { HeaderUserProvider } from "@/components/layout/header-user-provider";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Провайдер пользователя оборачивает шапку и страницы: блок аккаунта в кабинете
 * читает тот же контекст, а страница «Аккаунт» обновляет его после правки.
 * Провайдер клиентский и читает сессию в браузере, поэтому страницы остаются статическими.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <HeaderUserProvider>
      <SiteHeader />
      {children}
    </HeaderUserProvider>
  );
}
