import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ListingCreateGate } from "@/components/listing-create/listing-create-gate";

export const metadata: Metadata = { title: "Новое объявление" };

/**
 * Вход проверяет клиент. Пока нет выбора организации (PR 3), вместо формы заглушка,
 * поэтому справочники (`getCategoryTree`, города, бренды, цвета, страны) здесь не читаются.
 */
export default function NewListingPage() {
  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold lg:text-3xl">Новое объявление</h1>
        <ListingCreateGate />
      </Container>
    </main>
  );
}
