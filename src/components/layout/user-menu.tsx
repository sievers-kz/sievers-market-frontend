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
import { cn } from "@/lib/utils";

import { USER_BUTTON_CLASS } from "./user-button-class";
import { getDisplayName } from "./user-display";

/**
 * Блок вошедшего пользователя с `md`: круглая иконка (`bg-primary/10`) с выпадающим меню. Пункты — страницы кабинета
 * (`ACCOUNT_MENU_ITEMS`, как в сайдбаре, без пунктов без страницы), затем «Выйти».
 */
export function UserMenu({
  user,
  onLoggedOut,
  className,
}: {
  user: CurrentUser;
  onLoggedOut: () => void;
  className?: string;
}) {
  const { logout, pending } = useLogout(onLoggedOut);
  const displayName = getDisplayName(user);

  return (
    <DropdownMenu>
      {/* Radix сам ставит `aria-haspopup="menu"` и `aria-expanded`. */}
      <DropdownMenuTrigger
        disabled={pending}
        aria-label="Меню пользователя"
        className={cn(USER_BUTTON_CLASS, className)}
      >
        <UserRound aria-hidden className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        collisionPadding={16}
        className="max-w-[calc(100vw-32px)] min-w-56 p-2"
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
