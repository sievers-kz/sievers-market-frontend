"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AuthError({
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
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">Что-то пошло не так</h1>
      <p className="text-muted-foreground">Проверьте подключение и попробуйте ещё раз.</p>
      <Button type="button" onClick={() => retry()}>
        Повторить
      </Button>
    </div>
  );
}
