import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** «Подать объявление» высотой h-10 (заливка cta) для `/dev/logo`. */
export function LogoPreviewPostButton({ className }: { className?: string }) {
  return (
    <Button asChild className={cn("bg-cta px-4 text-cta-foreground hover:bg-cta/90", className)}>
      <Link href="/listings/new">Подать объявление</Link>
    </Button>
  );
}
