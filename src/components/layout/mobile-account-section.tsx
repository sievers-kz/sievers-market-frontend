"use client";

import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

import { ACCOUNT_MENU_ITEMS } from "@/components/account/account-nav-items";
import { useLogout } from "@/hooks/use-logout";
import { cn } from "@/lib/utils";

import { isHeaderNavActive } from "./header-nav-links";
import { useHeaderUser } from "./header-user-provider";

const ROW =
  "flex min-h-10 w-full items-center gap-2 rounded-sm py-2 text-base font-medium transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

/**
 * Раздел «Личный кабинет» в мобильном меню: пункты кабинета (как в меню пользователя в шапке) и «Выйти».
 * Гостю вместо раздела ссылка «Войти». Пока пользователь загружается, раздела нет.
 */
export function MobileAccountSection({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const { state, showGuest } = useHeaderUser();
  const { logout, pending } = useLogout(showGuest);
  const titleId = useId();

  if (state.status === "loading") return null;

  if (state.user === null) {
    return (
      <div className="border-t py-4">
        <Link href="/login" onClick={onNavigate} className={ROW}>
          <LogIn aria-hidden />
          Войти
        </Link>
      </div>
    );
  }

  return (
    <section aria-labelledby={titleId} className="border-t py-4">
      <h2 id={titleId} className="text-xs font-medium text-muted-foreground">
        Личный кабинет
      </h2>
      <ul className="mt-2">
        {ACCOUNT_MENU_ITEMS.map((item) => {
          // «Аккаунт» (/account) активен только на своей странице: под ним лежит весь кабинет.
          const active = item.exact ? pathname === item.href : isHeaderNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(ROW, active && "text-primary")}
              >
                <item.icon aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              onNavigate();
              void logout();
            }}
            className={ROW}
          >
            <LogOut aria-hidden />
            Выйти
          </button>
        </li>
      </ul>
    </section>
  );
}
