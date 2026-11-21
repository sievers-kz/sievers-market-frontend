import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { GuestActions } from "@/components/layout/guest-actions";
import { cn } from "@/lib/utils";

/**
 * Одноуровневая шапка для `/dev/logo`: слева логотип, справа кнопки гостя.
 * Без «Каталога», поиска, «Подать объявление» и «Организаций». По умолчанию кнопки из `GuestActions`
 * (на телефоне только «Войти»). Удалить вместе со страницей.
 */
export function LogoPreviewSingleHeader({
  logo,
  actions,
  className,
}: {
  logo: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("border-b bg-background", className)}>
      <Container className="flex items-center gap-4 py-4">
        {logo}
        <div className="ml-auto">{actions ?? <GuestActions />}</div>
      </Container>
    </header>
  );
}
