import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";

import { LogoPreviewCatalogGhostButton } from "./logo-preview-catalog-ghost-button";
import { LogoPreviewCompactSearch } from "./logo-preview-compact-search";
import { LogoPreviewGuestButtons } from "./logo-preview-guest-buttons";
import { LogoPreviewMenuButton } from "./logo-preview-menu-button";
import { LogoPreviewOrganizationsLink } from "./logo-preview-organizations-link";
import { LogoPreviewPostButton } from "./logo-preview-post-button";

/**
 * Шапка в один ярус для `/dev/logo`: логотип | Каталог | поиск | Организации | Подать | Войти | Регистрация.
 * Ниже `lg` только логотип и бургер; «Регистрация» появляется с `xl`.
 */
export function LogoPreviewOneTierHeader({ logo }: { logo: ReactNode }) {
  return (
    <header className="border-b bg-background">
      <Container className="flex items-center gap-4 py-4">
        {logo}
        <LogoPreviewCatalogGhostButton className="hidden lg:inline-flex" />
        <LogoPreviewCompactSearch className="hidden lg:flex" />
        <LogoPreviewOrganizationsLink className="hidden lg:inline" />
        <LogoPreviewPostButton className="hidden lg:inline-flex" />
        <LogoPreviewGuestButtons className="hidden lg:flex" registerClassName="hidden xl:inline-flex" />
        <LogoPreviewMenuButton className="ml-auto lg:hidden" />
      </Container>
    </header>
  );
}
