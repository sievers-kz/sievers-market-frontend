"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useHeaderUser } from "./header-user-provider";

const NEW_LISTING_PATH = "/listings/new";
const LOGIN_PATH = `/login?next=${encodeURIComponent(NEW_LISTING_PATH)}`;

/**
 * Гость идёт на вход, остальные (и пока проверка идёт) на страницу создания:
 * доступ там всё равно проверяет `ListingCreateGate` (страховка для прямого перехода).
 */
export function PostListingButton({ className }: { className?: string }) {
  const { state } = useHeaderUser();
  const isGuest = state.status === "ready" && state.user === null;

  return (
    <Button
      asChild
      size="lg"
      className={cn("bg-cta text-cta-foreground hover:bg-cta/90", className)}
    >
      <Link href={isGuest ? LOGIN_PATH : NEW_LISTING_PATH}>Подать объявление</Link>
    </Button>
  );
}
