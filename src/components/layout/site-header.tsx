import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Container } from "./container";
import { HeaderSearch } from "./header-search";
import { HeaderUserBlock } from "./header-user-block";
import { SiteLogo } from "./site-logo";

/**
 * Шапка сайта. Сама не читает cookie: блок пользователя клиентский,
 * иначе все страницы под шапкой стали бы динамическими (см. docs/pages/header.md).
 */
export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <Container className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          <SiteLogo />
          <div className="ml-auto flex items-center gap-4">
            {/* Слот под разделы («Поставщики», «Поддержка»): состав ещё не решён. */}
            <HeaderUserBlock />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Заглушка под мега-меню каталога. */}
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
