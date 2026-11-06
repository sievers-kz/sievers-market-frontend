"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useHeaderUser } from "./header-user-provider";

const NEW_LISTING_PATH = "/listings/new";
const LOGIN_PATH = `/login?next=${encodeURIComponent(NEW_LISTING_PATH)}`;

const LABEL = "Подать объявление";

/**
 * Кнопка в шапке ведёт сразу туда, куда нужно, по уже загруженному пользователю шапки.
 * Пока проверка идёт, ведёт на страницу создания: доступ там всё равно проверяет
 * `ListingCreateGate` (страховка для прямого перехода по адресу).
 */
export function PostListingButton({ className }: { className?: string }) {
  const { state } = useHeaderUser();
  const buttonClass = cn("bg-cta text-cta-foreground hover:bg-cta/90", className);

  const user = state.status === "ready" ? state.user : undefined;

  if (user?.role === "customer") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" size="lg" className={buttonClass}>
            {LABEL}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={8} collisionPadding={16} className="w-72 p-4">
          {/* Действия «Стать продавцом» нет: /onboarding пускает только пользователей
              без роли, а перехода покупатель → продавец пока нет (см. docs/STATUS.md). */}
          <p className="text-sm font-medium">Чтобы подать объявление, станьте продавцом</p>
        </PopoverContent>
      </Popover>
    );
  }

  let href = NEW_LISTING_PATH;
  if (user === null) href = LOGIN_PATH;
  else if (user?.role === null) href = "/onboarding";

  return (
    <Button asChild size="lg" className={buttonClass}>
      <Link href={href}>{LABEL}</Link>
    </Button>
  );
}
