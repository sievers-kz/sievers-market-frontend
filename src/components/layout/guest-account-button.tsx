import { UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Блок пользователя для гостя: круглая иконка без рамки, ведёт на вход. */
export function GuestAccountButton() {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="rounded-full text-foreground hover:bg-muted hover:text-foreground"
    >
      <Link href="/login" aria-label="Войти" title="Войти">
        <UserRound aria-hidden className="size-5" />
      </Link>
    </Button>
  );
}
