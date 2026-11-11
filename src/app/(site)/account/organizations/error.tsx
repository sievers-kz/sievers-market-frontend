"use client";

import { useEffect } from "react";

import { ORGANIZATIONS_TEXT } from "@/components/account/organization-labels";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function OrganizationsError({
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
    <main className="flex-1 bg-muted py-16">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">{ORGANIZATIONS_TEXT.pageError}</h1>
        <p className="text-muted-foreground">Проверьте подключение и попробуйте ещё раз.</p>
        <Button type="button" onClick={() => retry()}>
          {ORGANIZATIONS_TEXT.retry}
        </Button>
      </Container>
    </main>
  );
}
