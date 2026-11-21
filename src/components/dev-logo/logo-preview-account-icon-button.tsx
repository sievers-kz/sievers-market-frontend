import { UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Иконка аккаунта (контурная, 40×40) для `/dev/logo`: гость, ведёт на `/login`. */
export function LogoPreviewAccountIconButton() {
  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="border-primary bg-transparent text-primary shadow-none hover:bg-accent hover:text-primary"
    >
      <Link href="/login" aria-label="Войти" title="Войти">
        <UserRound aria-hidden className="size-5" />
      </Link>
    </Button>
  );
}
