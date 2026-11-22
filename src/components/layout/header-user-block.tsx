"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { GuestAccountButton } from "./guest-account-button";
import { useHeaderUser } from "./header-user-provider";
import { MobileAccountSheet } from "./mobile-account-sheet";
import { UserMenu } from "./user-menu";

export function HeaderUserBlock() {
  const { state, showGuest } = useHeaderUser();

  if (state.status === "loading") {
    return <Skeleton className="size-10 rounded-full" />;
  }

  const { user } = state;
  if (user === null) return <GuestAccountButton />;
  // Ниже `md` панель справа, с `md` выпадающее меню; гость на любой ширине сразу идёт на /login.
  return (
    <>
      <MobileAccountSheet user={user} onLoggedOut={showGuest} className="md:hidden" />
      <UserMenu user={user} onLoggedOut={showGuest} className="hidden md:flex" />
    </>
  );
}
