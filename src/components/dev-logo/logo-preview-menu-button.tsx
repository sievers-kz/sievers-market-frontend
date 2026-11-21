import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Бургер для мобильной шапки на `/dev/logo`. Меню не открывает: только вид. */
export function LogoPreviewMenuButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Меню"
      className={cn("text-foreground", className)}
    >
      <Menu aria-hidden className="size-6" />
    </Button>
  );
}
