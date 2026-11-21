import { UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Блок пользователя для гостя: круглая иконка на `bg-muted` (при наведении `bg-border`), ведёт на вход. */
export function GuestAccountButton() {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="rounded-full bg-muted text-foreground hover:bg-border hover:text-foreground"
    >
      <Link href="/login" aria-label="Войти" title="Войти">
        <UserRound aria-hidden className="size-5" />
      </Link>
    </Button>
  );
}
