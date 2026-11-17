import type { ReactNode } from "react";

import { AccountShell } from "@/components/account/account-shell";

/** Каркас кабинета: docs/pages/account-layout.md. Без запросов, вход проверяют страницы. */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
