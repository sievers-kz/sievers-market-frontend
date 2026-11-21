import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

import { LogoPreviewAccountIconButton } from "./logo-preview-account-icon-button";
import { LogoPreviewMenuButton } from "./logo-preview-menu-button";
import { LogoPreviewNavMenu } from "./logo-preview-nav-menu";
import { LogoPreviewPostButton } from "./logo-preview-post-button";
import { LogoPreviewPostIconButton } from "./logo-preview-post-icon-button";
import { LogoPreviewSearchIconButton } from "./logo-preview-search-icon-button";

/**
 * Одноуровневая шапка с точным центрированием разделов (сетка `1fr auto 1fr`, с `lg`) для `/dev/logo`.
 * Справа: поиск-иконка, «Подать объявление» (`post`: текстом или «+»), иконка аккаунта.
 * `floating`: шапка-карточка внутри `Container` с отступом сверху 16, панель каталога карточкой под ней.
 * Ниже `lg` логотип и бургер (при `post="icon"` ещё «+»).
 */
export function LogoPreviewCenteredHeader({
  logo,
  post,
  floating = false,
}: {
  logo: ReactNode;
  post: "text" | "icon";
  floating?: boolean;
}) {
  const row = (
    <div
      className={cn(
        "flex items-center gap-4 py-4 lg:grid lg:grid-cols-[1fr_auto_1fr]",
        floating ? "px-6" : undefined,
      )}
    >
      <div className="flex min-w-0 justify-start">{logo}</div>
      <LogoPreviewNavMenu
        className="hidden lg:flex"
        // Панель позиционируется от внутреннего края рамки карточки: сдвиг на 1px выравнивает её с карточкой.
        viewportWrapperClassName={floating ? "-inset-x-px mt-2 translate-y-px" : undefined}
        viewportClassName={floating ? "overflow-hidden rounded-2xl border shadow-md" : undefined}
        panelClassName={floating ? "px-6" : undefined}
      />
      <div className="ml-auto flex items-center justify-end gap-4 lg:ml-0">
        <div className="hidden items-center gap-4 lg:flex">
          <LogoPreviewSearchIconButton />
          {post === "text" ? <LogoPreviewPostButton /> : <LogoPreviewPostIconButton />}
          <LogoPreviewAccountIconButton />
        </div>
        {post === "icon" && <LogoPreviewPostIconButton className="lg:hidden" />}
        <LogoPreviewMenuButton className="lg:hidden" />
      </div>
    </div>
  );

  if (floating) {
    return (
      <Container className="pt-4">
        <header className="relative rounded-2xl border bg-background shadow-sm">{row}</header>
      </Container>
    );
  }

  return (
    <header className="relative border-b bg-background">
      <Container>{row}</Container>
    </header>
  );
}
