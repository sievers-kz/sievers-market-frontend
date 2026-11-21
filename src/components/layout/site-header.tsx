import { getCategoryTree } from "@/lib/api/catalog";

import { toCatalogMenuTree, type CatalogMenuTree } from "./catalog-menu-tree";
import { Container } from "./container";
import { HeaderMobileMenu } from "./header-mobile-menu";
import { HeaderNav } from "./header-nav";
import { HeaderSearchOverlay } from "./header-search-overlay";
import { HeaderUserBlock } from "./header-user-block";
import { PostListingButton } from "./post-listing-button";
import { SiteLogo } from "./site-logo";

/**
 * Шапка сайта. Сама не читает cookie: пользователя загружает клиентский
 * `HeaderUserProvider` в `SiteChrome` (layout групп `(site)` и `(auth)`; один запрос на шапку и кабинет),
 * иначе все страницы под шапкой стали бы динамическими (см. docs/pages/header.md).
 * Дерево каталога для мега-меню читается здесь: запрос кэшируется и не трогает cookie.
 */
export async function SiteHeader() {
  // В клиент уходит облегчённое дерево (только id и названия): оно нужно меню и бургеру.
  let tree: CatalogMenuTree | null;
  try {
    tree = toCatalogMenuTree(await getCategoryTree());
  } catch {
    // Шапка и страница не ломаются: меню покажет «Каталог временно недоступен».
    tree = null;
  }

  return (
    // `relative z-50`: от шапки позиционируются панель каталога и поле поиска, и она выше затемнения поиска.
    <header className="relative z-50 border-b bg-background">
      {/* С `lg` сетка 1fr auto 1fr: разделы точно по центру страницы. */}
      <Container className="flex items-center gap-4 py-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex min-w-0 items-center">
          <SiteLogo />
        </div>
        <HeaderNav tree={tree} className="hidden lg:flex" />
        <div className="ml-auto flex items-center justify-end gap-2 md:gap-4 lg:ml-0">
          <HeaderSearchOverlay />
          <PostListingButton variant="outline" className="hidden md:inline-flex" />
          <HeaderUserBlock />
          <HeaderMobileMenu tree={tree} className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
