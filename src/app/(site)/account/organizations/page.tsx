import type { Metadata } from "next";

import { OrganizationsView } from "@/components/account/organizations-view";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Мои организации",
  robots: { index: false },
};

/** Вход и список проверяет клиент (`OrganizationsView`): на сервере токен не обновляется. */
export default function OrganizationsPage() {
  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <OrganizationsView />
      </Container>
    </main>
  );
}
