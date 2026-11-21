import Link from "next/link";
import type { ReactNode } from "react";

import { CatalogMegaMenu } from "@/components/layout/catalog-mega-menu";
import { Container } from "@/components/layout/container";
import { GuestActions } from "@/components/layout/guest-actions";
import { HeaderSearch } from "@/components/layout/header-search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Временная копия вёрстки `SiteHeader` для страницы `/dev/logo`, без запросов к API:
 * дерево каталога `null`, блок пользователя всегда гость, «Подать объявление» ведёт на `/listings/new`.
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

        <CatalogMegaMenu tree={null}>
          <HeaderSearch />
          <Button
            asChild
            size="lg"
            className="hidden bg-cta text-cta-foreground hover:bg-cta/90 md:inline-flex"
          >
            <Link href="/listings/new">Подать объявление</Link>
          </Button>
        </CatalogMegaMenu>
      </Container>
    </header>
  );
}
