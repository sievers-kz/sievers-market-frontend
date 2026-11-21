import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";

import { LogoPreviewCatalogGhostButton } from "./logo-preview-catalog-ghost-button";
import { LogoPreviewCompactSearch } from "./logo-preview-compact-search";
import { LogoPreviewGuestButtons } from "./logo-preview-guest-buttons";
import { LogoPreviewMenuButton } from "./logo-preview-menu-button";
import { LogoPreviewOrganizationsLink } from "./logo-preview-organizations-link";
import { LogoPreviewPostButton } from "./logo-preview-post-button";

/**
 * Два яруса с лёгким нижним для `/dev/logo`. Верх: логотип, «Организации», «Войти», «Регистрация».
 * Низ: «Каталог»-призрак, поиск, «Подать объявление». Ниже `md` только логотип и бургер.
 */
export function LogoPreviewLightTwoTierHeader({ logo }: { logo: ReactNode }) {
  return (
    <header className="border-b bg-background">
      <Container className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          {logo}
          <div className="ml-auto hidden items-center gap-4 md:flex">
            <LogoPreviewOrganizationsLink />
            <LogoPreviewGuestButtons />
          </div>
          <LogoPreviewMenuButton className="ml-auto md:hidden" />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <LogoPreviewCatalogGhostButton />
          <LogoPreviewCompactSearch />
          <LogoPreviewPostButton />
        </div>
      </Container>
    </header>
  );
}
