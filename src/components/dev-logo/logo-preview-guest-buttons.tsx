import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * «Войти» и «Регистрация» в стилях `GuestActions`, но с управляемой видимостью «Регистрации»
 * (`registerClassName`) для `/dev/logo`.
 */
export function LogoPreviewGuestButtons({
  className,
  registerClassName,
}: {
  className?: string;
  registerClassName?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center gap-4", className)}>
      <Button
        asChild
        variant="outline"
        className="border-primary bg-transparent px-4 text-primary shadow-none hover:bg-accent hover:text-primary"
      >
        <Link href="/login">Войти</Link>
      </Button>
      <Button asChild className={cn("px-4", registerClassName)}>
        <Link href="/register">Регистрация</Link>
      </Button>
    </div>
  );
}
