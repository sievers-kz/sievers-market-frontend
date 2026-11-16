import type { Metadata } from "next";

import { AccountView } from "@/components/account/account-view";

export const metadata: Metadata = {
  title: "Настройки аккаунта",
  robots: { index: false },
};

/**
 * Пользователя читает клиент (`AccountView`): на сервере токен не обновляется.
 * `<main>` и `Container` рисует каркас кабинета (`account/layout.tsx`).
 */
export default function AccountPage() {
  return <AccountView />;
}
