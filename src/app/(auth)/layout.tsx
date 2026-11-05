import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center bg-muted py-8 md:py-16">
      <Container className="flex justify-center">{children}</Container>
    </main>
  );
}
