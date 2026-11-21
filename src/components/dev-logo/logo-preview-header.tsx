import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { GuestActions } from "@/components/layout/guest-actions";
import { HeaderSearch } from "@/components/layout/header-search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Временная копия вёрстки `SiteHeader` для страницы `/dev/logo`, без запросов к API:
 * «Каталог» без меню, блок пользователя всегда гость, «Подать объявление» ведёт на `/listings/new`.
 * Логотип и фон шапки приходят пропами. Удалить вместе со страницей.
 */
export function LogoPreviewHeader({
  logo,
  className,
}: {
  logo: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("border-b bg-background", className)}>
      <Container className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          {logo}
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/organizations"
              className="hidden text-sm font-medium text-primary hover:underline md:inline"
            >
              Организации
            </Link>
            <GuestActions />
          </div>
        </div>

        {/* Прежний нижний ряд: залитая «Каталог» (только вид), поиск, «Подать объявление». */}
        <div className="flex items-center gap-4">
          <Button type="button" size="lg" aria-label="Каталог" className="px-4 md:px-6">
            <LayoutGrid aria-hidden />
            <span className="hidden md:inline">Каталог</span>
          </Button>
          <HeaderSearch />
          <Button
            asChild
            size="lg"
            className="hidden bg-cta text-cta-foreground hover:bg-cta/90 md:inline-flex"
          >
            <Link href="/listings/new">Подать объявление</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
