import Link from "next/link";

import { getCategoryTree, type CategoryTree } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

import { CatalogMegaMenu } from "./catalog-mega-menu";
import { Container } from "./container";
import { HEADER_NAV_ITEM_CLASS } from "./header-nav-item";
import { HeaderSearchOverlay } from "./header-search-overlay";
import { HeaderUserBlock } from "./header-user-block";
import { PostListingButton } from "./post-listing-button";
import { SiteLogo } from "./site-logo";

/**
 * Шапка сайта. Сама не читает cookie: пользователя загружает клиентский
 * `HeaderUserProvider` в `(site)/layout.tsx` (один запрос на шапку и кабинет),
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
    // `relative z-50`: от шапки позиционируется поле поиска, и она остаётся над затемнением поиска.
    <header className="relative z-50 border-b bg-background">
      <Container className="py-4">
        <CatalogMegaMenu
          tree={tree}
          logo={<SiteLogo />}
          links={
            <Link href="/organizations" className={HEADER_NAV_ITEM_CLASS}>
              Организации
            </Link>
          }
          actions={
            <>
              {/* На md–lg центральной части нет: «Организации» справа; на телефоне места нет. */}
              <Link href="/organizations" className={cn(HEADER_NAV_ITEM_CLASS, "hidden md:inline-flex lg:hidden")}>
                Организации
              </Link>
              <HeaderSearchOverlay />
              <PostListingButton variant="outline" className="hidden md:inline-flex" />
              <HeaderUserBlock />
            </>
          }
        />
      </Container>
    </header>
  );
}
