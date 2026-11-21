"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { GuestAccountButton } from "./guest-account-button";
import { useHeaderUser } from "./header-user-provider";
import { UserMenu } from "./user-menu";

export function HeaderUserBlock() {
  const { state, showGuest } = useHeaderUser();

  if (state.status === "loading") {
    return <Skeleton className="size-10 rounded-full" />;
  }

  const { user } = state;
  if (user === null) return <GuestAccountButton />;
  return <UserMenu user={user} onLoggedOut={showGuest} />;
}
