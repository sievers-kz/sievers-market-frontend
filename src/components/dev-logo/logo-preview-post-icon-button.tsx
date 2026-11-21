import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** «Подать объявление» иконкой «+» (40×40, заливка cta, подсказка `title`) для `/dev/logo`. */
export function LogoPreviewPostIconButton({ className }: { className?: string }) {
  return (
    <Button
      asChild
      size="icon"
      className={cn("bg-cta text-cta-foreground hover:bg-cta/90", className)}
    >
      <Link href="/listings/new" aria-label="Подать объявление" title="Подать объявление">
        <Plus aria-hidden className="size-5" />
      </Link>
    </Button>
  );
}
