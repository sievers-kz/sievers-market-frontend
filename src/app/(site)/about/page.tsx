import type { Metadata } from "next";

import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "О нас",
  robots: { index: false, follow: false },
};

/** Заглушка раздела: содержимое добавим позже (docs/STATUS.md). */
export default function AboutPage() {
  return (
    <main className="flex-1 py-16">
      <Container>
        <h1 className="text-2xl font-semibold">О нас</h1>
        <p className="mt-4 text-muted-foreground">Раздел в разработке</p>
      </Container>
    </main>
  );
}
