"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";

export function NoRoleActions({ onLoggedOut }: { onLoggedOut: () => void }) {
  const { logout, pending } = useLogout(onLoggedOut);
  return (
    <div className="flex items-center gap-4">
      <Button asChild className="px-4 md:px-6">
        <Link href="/onboarding">Завершить профиль</Link>
      </Button>
      <Button variant="ghost" disabled={pending} onClick={() => void logout()}>
        Выйти
      </Button>
    </div>
  );
}
