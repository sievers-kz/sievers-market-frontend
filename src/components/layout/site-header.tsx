import { LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Container } from "./container";
import { HeaderSearch } from "./header-search";
import { HeaderUserBlock } from "./header-user-block";
import { HeaderUserProvider } from "./header-user-provider";
import { PostListingButton } from "./post-listing-button";
import { SiteLogo } from "./site-logo";

/**
 * Шапка сайта. Сама не читает cookie: пользователя загружает клиентский
 * `HeaderUserProvider` (один запрос на блок пользователя и «Подать объявление»),
 * иначе все страницы под шапкой стали бы динамическими (см. docs/pages/header.md).
 */
export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <HeaderUserProvider>
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
            <PostListingButton className="hidden md:inline-flex" />
          </div>
        </Container>
      </HeaderUserProvider>
    </header>
  );
}
