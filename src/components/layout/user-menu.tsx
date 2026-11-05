"use client";

import { ChevronDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-logout";

import { getAvatarLetter, getDisplayName, type UserWithRole } from "./user-display";

/** Аватар с меню. Пункты добавляем, только когда есть страницы (docs/pages/header.md). */
export function UserMenu({
  user,
  onLoggedOut,
}: {
  user: UserWithRole;
  onLoggedOut: () => void;
}) {
  const { logout, pending } = useLogout(onLoggedOut);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        aria-label="Меню пользователя"
        className="flex h-10 items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-muted font-semibold">
          {getAvatarLetter(user)}
        </span>
        <ChevronDown aria-hidden className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        collisionPadding={16}
        className="w-64 max-w-[calc(100vw-32px)] p-2"
      >
        <DropdownMenuLabel className="flex flex-col gap-1 px-2 py-2 font-normal">
          <span className="truncate font-medium">{getDisplayName(user)}</span>
          <span className="truncate text-muted-foreground">{user.profile.email}</span>
        </DropdownMenuLabel>
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
