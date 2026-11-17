import Link from "next/link";

import { Container } from "./container";

/** Временная страница, чтобы ссылки не вели в 404. */
export function StubPage({ title }: { title: string }) {
  return (
    <main className="flex-1 py-16">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">Этот раздел скоро появится.</p>
        <Link href="/" className="text-sm text-primary hover:underline">
          На главную
        </Link>
      </Container>
    </main>
  );
}
