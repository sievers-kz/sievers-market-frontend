import type { ReactNode } from "react";

import { HeaderUserProvider } from "./header-user-provider";
import { SiteHeader } from "./site-header";

/**
 * Общая обёртка страниц: клиентский провайдер пользователя, шапка и содержимое.
 * Подключается в layout групп `(site)` и `(auth)` (у каждой свой layout, а не общий родительский):
 * при переходе со входа на сайт layout меняется, провайдер монтируется заново и перечитывает
 * пользователя. Формы входа и подтверждения провайдер сами не обновляют.
 * Провайдер читает сессию в браузере, поэтому страницы не становятся динамическими.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <HeaderUserProvider>
      <SiteHeader />
      {children}
    </HeaderUserProvider>
  );
}
