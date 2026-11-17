import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { MinimalHeader } from "@/components/layout/minimal-header";

// Вход, регистрация и восстановление пароля не нужны в поиске.
export const metadata: Metadata = { robots: { index: false } };

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MinimalHeader />
      <main className="flex flex-1 items-center bg-muted py-8 md:py-16">
        <Container className="flex justify-center">{children}</Container>
      </main>
    </>
  );
}
