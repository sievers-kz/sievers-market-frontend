"use client";

import { useEffect } from "react";

import { ORGANIZATION_DETAIL_TEXT } from "@/components/account/organization-labels";
import { Button } from "@/components/ui/button";

export default function OrganizationError({
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
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-12 text-center sm:px-8">
      <h1 className="text-2xl font-semibold">{ORGANIZATION_DETAIL_TEXT.pageError}</h1>
      <p className="text-muted-foreground">Проверьте подключение и попробуйте ещё раз.</p>
      <Button type="button" onClick={() => retry()}>
        {ORGANIZATION_DETAIL_TEXT.retry}
      </Button>
    </div>
  );
}
