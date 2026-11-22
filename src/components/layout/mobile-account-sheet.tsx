"use client";

import { LogOut, UserRound, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ACCOUNT_MENU_ITEMS } from "@/components/account/account-nav-items";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";
import { useLogout } from "@/hooks/use-logout";
import type { CurrentUser } from "@/lib/api";
import { cn } from "@/lib/utils";

import { isHeaderNavActive } from "./header-nav-links";
import { USER_BUTTON_CLASS } from "./user-button-class";
import { getDisplayName } from "./user-display";

const ROW =
  "flex min-h-10 w-full items-center gap-2 rounded-sm px-2 py-2 text-base transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

/**
 * Кабинет вошедшего пользователя ниже `md`: та же круглая иконка, что у меню с `md`, открывает панель
 * справа (`Sheet`) с пунктами кабинета (`ACCOUNT_MENU_ITEMS`, как в выпадающем меню) и «Выйти» последним.
 */
export function MobileAccountSheet({
  user,
  onLoggedOut,
  className,
}: {
  user: CurrentUser;
  onLoggedOut: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useCloseOnNavigation(setOpen);
  const { logout, pending } = useLogout(onLoggedOut);
  const displayName = getDisplayName(user);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={pending}
        aria-label="Меню пользователя"
        className={cn(USER_BUTTON_CLASS, className)}
      >
        <UserRound aria-hidden className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} aria-describedby={undefined} className="gap-0">
        <div className="flex items-start justify-between gap-4 border-b px-4 py-2">
          <div className="flex min-w-0 flex-col gap-1 py-2">
            <SheetTitle className="truncate">{displayName ?? "Пользователь"}</SheetTitle>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <SheetClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Закрыть">
              <XIcon aria-hidden />
            </Button>
          </SheetClose>
        </div>

        <nav aria-label="Личный кабинет" className="min-h-0 flex-1 overflow-y-auto p-2">
          <ul>
            {ACCOUNT_MENU_ITEMS.map((item) => {
              // «Аккаунт» (/account) активен только на своей странице: под ним лежит весь кабинет.
              const active = item.exact ? pathname === item.href : isHeaderNavActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(ROW, active && "text-primary [&_svg]:text-primary")}
                  >
                    <item.icon aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 border-t pt-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                close();
                void logout();
              }}
              className={ROW}
            >
              <LogOut aria-hidden />
              Выйти
            </button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
