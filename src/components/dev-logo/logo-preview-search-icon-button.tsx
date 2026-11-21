import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Иконка поиска в шапке `/dev/logo`. Только вид: поле поиска не открывает. */
export function LogoPreviewSearchIconButton() {
  return (
    <Button type="button" variant="ghost" size="icon" aria-label="Поиск" className="text-foreground">
      <Search aria-hidden className="size-5" />
    </Button>
  );
}
