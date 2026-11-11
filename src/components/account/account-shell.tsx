import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";

import { AccountNav } from "./account-nav";
import { AccountUserBlock } from "./account-user-block";

/**
 * Раскладка личного кабинета: сайдбар-карточка 304 (блок аккаунта и навигация;
 * ниже `lg` только строка вкладок) и колонка контента. Вход проверяет каждая страница.
 */
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 bg-muted py-6 lg:py-8">
      <Container className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <aside className="-mx-4 lg:mx-0 lg:w-76 lg:shrink-0 lg:self-start lg:rounded-2xl lg:bg-card lg:p-4">
          <AccountUserBlock />
          <AccountNav />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
      </Container>
    </main>
  );
}
