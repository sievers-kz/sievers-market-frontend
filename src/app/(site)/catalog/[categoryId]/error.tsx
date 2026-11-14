"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/container";

export default function CatalogError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 py-16">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Не удалось загрузить каталог</h1>
        <p className="text-muted-foreground">
          Проверьте подключение и попробуйте ещё раз.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="h-10 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Повторить
        </button>
      </Container>
    </main>
  );
}
