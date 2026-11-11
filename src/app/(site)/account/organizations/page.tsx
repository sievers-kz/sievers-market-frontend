import type { Metadata } from "next";

import { OrganizationsView } from "@/components/account/organizations-view";

export const metadata: Metadata = {
  title: "Мои организации",
  robots: { index: false },
};

/**
 * Вход и список проверяет клиент (`OrganizationsView`): на сервере токен не обновляется.
 * `<main>` и `Container` рисует каркас кабинета (`account/layout.tsx`).
 */
export default function OrganizationsPage() {
  return <OrganizationsView />;
}
