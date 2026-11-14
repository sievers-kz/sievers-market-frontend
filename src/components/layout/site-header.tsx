import { getCategoryTree, type CategoryTree } from "@/lib/api/catalog";

import { CatalogMegaMenu } from "./catalog-mega-menu";
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
 * Дерево каталога для мега-меню читается здесь: запрос кэшируется и не трогает cookie.
 */
export async function SiteHeader() {
  let tree: CategoryTree | null;
  try {
    tree = await getCategoryTree();
  } catch {
    // Шапка и страница не ломаются: меню покажет «Каталог временно недоступен».
    tree = null;
  }

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

          <CatalogMegaMenu tree={tree}>
            <HeaderSearch />
            <PostListingButton className="hidden md:inline-flex" />
          </CatalogMegaMenu>
        </Container>
      </HeaderUserProvider>
    </header>
  );
}
