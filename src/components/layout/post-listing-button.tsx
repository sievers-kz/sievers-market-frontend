"use client";

import { Plus } from "lucide-react";
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
export function PostListingButton({
  className,
  variant = "cta",
  alwaysShowLabel = false,
  onClick,
}: {
  className?: string;
  /** Для `outline`: текст на любой ширине (мобильное меню), а не только с `md`. */
  alwaysShowLabel?: boolean;
  onClick?: () => void;
  /** `cta` — заливка cta, h-12 (как было); `outline` — контурная primary, h-10, «+» и текст (на lg–xl только «+»), для шапки. */
  variant?: "cta" | "outline";
}) {
  const { state } = useHeaderUser();
  const isGuest = state.status === "ready" && state.user === null;
  const href = isGuest ? LOGIN_PATH : NEW_LISTING_PATH;

  if (variant === "outline") {
    return (
      <Button
        asChild
        variant="outline"
        className={cn(
          "border-primary bg-transparent px-4 text-primary shadow-none hover:bg-primary/5 hover:text-primary",
          className,
        )}
      >
        <Link href={href} onClick={onClick} aria-label="Подать объявление" title="Подать объявление">
          <Plus aria-hidden />
          {/* На lg–xl только «+»: иначе правая часть шапки шире половины и разделы уходят с центра. */}
          <span className={alwaysShowLabel ? undefined : "hidden md:inline lg:hidden xl:inline"}>
            Подать объявление
          </span>
        </Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="lg"
      className={cn("bg-cta text-cta-foreground hover:bg-cta/90", className)}
    >
      <Link href={href} onClick={onClick}>
        Подать объявление
      </Link>
    </Button>
  );
}
