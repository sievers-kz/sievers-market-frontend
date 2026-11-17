import Link from "next/link";

import { Container } from "@/components/layout/container";

export default function ListingNotFound() {
  return (
    <main className="flex-1 bg-muted py-16">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">
          Объявление не найдено или снято с публикации
        </h1>
        <Link href="/" className="font-medium text-primary hover:underline">
          В каталог
        </Link>
      </Container>
    </main>
  );
}
