"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

/** Блок пользователя для гостя: круглая иконка на `bg-muted` (при наведении `bg-border`), ведёт на вход. */
export function GuestAccountButton() {
  // На самой странице входа ссылка помечена текущей; вид не меняется.
  const isLoginPage = usePathname() === "/login";
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="rounded-full bg-muted text-foreground hover:bg-border hover:text-foreground"
    >
      <Link
        href="/login"
        aria-label="Войти"
        title="Войти"
        aria-current={isLoginPage ? "page" : undefined}
      >
        <UserRound aria-hidden className="size-5" />
      </Link>
    </Button>
  );
}
