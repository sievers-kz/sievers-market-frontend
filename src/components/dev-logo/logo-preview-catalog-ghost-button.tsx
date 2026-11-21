import { LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** «Каталог» кнопкой-призраком для `/dev/logo` (без заливки, текст primary). Мега-меню не открывает: только вид. */
export function LogoPreviewCatalogGhostButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn("px-4 text-primary hover:bg-accent hover:text-primary", className)}
    >
      <LayoutGrid aria-hidden />
      Каталог
    </Button>
  );
}
