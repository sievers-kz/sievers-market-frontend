import { UserRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { LogoPreviewMenuButton } from "./logo-preview-menu-button";
import { LogoPreviewNavMenu } from "./logo-preview-nav-menu";
import { LogoPreviewPostButton } from "./logo-preview-post-button";
import { LogoPreviewSearchIconButton } from "./logo-preview-search-icon-button";

const OUTLINE_CLASS =
  "border-primary bg-transparent px-4 text-primary shadow-none hover:bg-accent hover:text-primary";

/**
 * Одноуровневая шапка с разделами по центру для `/dev/logo`.
 * Справа поиск-иконка, «Подать объявление» и «Войти» (`guest`) или «Личный кабинет» (`user`).
 * Ниже `lg` только логотип и бургер; у «Личного кабинета» текст с `xl`.
 */
export function LogoPreviewNavHeader({ logo, variant }: { logo: ReactNode; variant: "guest" | "user" }) {
  return (
    <header className="relative border-b bg-background">
      <Container className="flex items-center gap-4 py-4">
        {logo}
        <LogoPreviewNavMenu className="hidden flex-1 lg:flex" />
        <div className="ml-auto hidden shrink-0 items-center gap-4 lg:flex">
          <LogoPreviewSearchIconButton />
          <LogoPreviewPostButton />
          {variant === "guest" ? (
            <Button asChild variant="outline" className={OUTLINE_CLASS}>
              <Link href="/login">Войти</Link>
            </Button>
          ) : (
            // На 1024–1279 текст не помещается: только иконка (с подписью для скринридера), текст с `xl`.
            <Button asChild variant="outline" className={cn(OUTLINE_CLASS, "w-10 px-0 xl:w-auto xl:px-4")}>
              <Link href="/account" aria-label="Личный кабинет">
                <UserRound aria-hidden />
                <span className="hidden xl:inline">Личный кабинет</span>
              </Link>
            </Button>
          )}
        </div>
        <LogoPreviewMenuButton className="ml-auto lg:hidden" />
      </Container>
    </header>
  );
}
