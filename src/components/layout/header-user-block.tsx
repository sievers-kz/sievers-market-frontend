"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { GuestActions } from "./guest-actions";
import { useHeaderUser } from "./header-user-provider";
import { NoRoleActions } from "./no-role-actions";
import { UserMenu } from "./user-menu";

export function HeaderUserBlock() {
  const { state, showGuest } = useHeaderUser();

  if (state.status === "loading") {
    return <Skeleton className="h-10 w-24 md:w-64" />;
  }

  const { user } = state;
  if (user === null) return <GuestActions />;
  if (user.role === null) return <NoRoleActions onLoggedOut={showGuest} />;
  return <UserMenu user={user} onLoggedOut={showGuest} />;
}
