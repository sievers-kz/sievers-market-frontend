import Link from "next/link";

import { Container } from "@/components/layout/container";

export default function CatalogNotFound() {
  return (
    <main className="flex-1 py-16">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Категория не найдена</h1>
        <p className="text-muted-foreground">
          Возможно, ссылка устарела или категория была удалена.
        </p>
        <Link href="/" className="font-medium text-primary hover:underline">
          На главную
        </Link>
      </Container>
    </main>
  );
}
