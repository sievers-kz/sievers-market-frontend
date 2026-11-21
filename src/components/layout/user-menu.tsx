"use client";

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";

import { ACCOUNT_MENU_ITEMS } from "@/components/account/account-nav-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-logout";
import type { CurrentUser } from "@/lib/api";

import { getDisplayName } from "./user-display";

/**
 * Блок вошедшего пользователя: круглая иконка (`bg-primary/10`) с меню. Пункты — страницы кабинета
 * (`ACCOUNT_MENU_ITEMS`, как в сайдбаре, без пунктов без страницы), затем «Выйти».
 */
export function UserMenu({
  user,
  onLoggedOut,
}: {
  user: CurrentUser;
  onLoggedOut: () => void;
}) {
  const { logout, pending } = useLogout(onLoggedOut);
  const displayName = getDisplayName(user);

  return (
    <DropdownMenu>
      {/* Radix сам ставит `aria-haspopup="menu"` и `aria-expanded`. */}
      <DropdownMenuTrigger
        disabled={pending}
        aria-label="Меню пользователя"
        className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary outline-none transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <UserRound aria-hidden className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        collisionPadding={16}
        className="w-64 max-w-[calc(100vw-32px)] p-2"
      >
        <DropdownMenuLabel className="flex flex-col gap-1 px-2 py-2 font-normal">
          <span className="truncate font-medium">{displayName ?? "Пользователь"}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ACCOUNT_MENU_ITEMS.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="px-2 py-2">
            <Link href={item.href}>
              <item.icon aria-hidden />
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending}
          onSelect={() => void logout()}
          className="px-2 py-2"
        >
          <LogOut aria-hidden />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
