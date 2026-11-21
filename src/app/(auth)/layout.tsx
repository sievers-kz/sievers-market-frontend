import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { SiteChrome } from "@/components/layout/site-chrome";

// Вход, регистрация и восстановление пароля не нужны в поиске.
export const metadata: Metadata = { robots: { index: false } };

export default function AuthLayout({ children }: { children: ReactNode }) {
  // Полная шапка, как на остальных страницах (docs/pages/header.md).
  return (
    <SiteChrome>
      <main className="flex flex-1 items-center bg-muted py-8 md:py-16">
        <Container className="flex justify-center">{children}</Container>
      </main>
    </SiteChrome>
  );
}
