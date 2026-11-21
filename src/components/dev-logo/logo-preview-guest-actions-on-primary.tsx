import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Кнопки гостя для шапки на фоне `bg-primary` (только `/dev/logo`): та же раскладка, что `GuestActions`,
 * цвета инвертированы токеном `primary-foreground`. «Регистрация» на телефоне скрыта, как в `GuestActions`.
 */
export function LogoPreviewGuestActionsOnPrimary() {
  return (
    <div className="flex items-center gap-4">
      <Button
        asChild
        variant="outline"
        className="border-primary-foreground bg-transparent px-4 text-primary-foreground shadow-none hover:bg-primary-foreground/10 hover:text-primary-foreground md:px-6"
      >
        <Link href="/login">Войти</Link>
      </Button>
      <Button
        asChild
        className="hidden bg-primary-foreground px-6 text-primary hover:bg-primary-foreground/90 md:inline-flex"
      >
        <Link href="/register">Регистрация</Link>
      </Button>
    </div>
  );
}
