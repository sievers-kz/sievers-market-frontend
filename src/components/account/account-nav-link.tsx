import Link from "next/link";
import type { RefObject } from "react";

import { cn } from "@/lib/utils";

import {
  ACCOUNT_NAV_TEXT,
  isAccountNavItemActive,
  type AccountNavItem,
} from "./account-nav-items";

/** Общая форма пункта: вкладка ниже `lg`, строка сайдбара с `lg`. */
const ITEM_CLASS = cn(
  "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm whitespace-nowrap outline-none",
  "focus-visible:ring-2 focus-visible:ring-ring",
  "lg:h-12 lg:gap-4 lg:rounded-lg lg:text-base",
);

/** Пункт навигации кабинета: ссылка или неактивный пункт «Скоро». */
export function AccountNavLink({
  item,
  pathname,
  activeRef,
}: {
  item: AccountNavItem;
  pathname: string;
  activeRef: RefObject<HTMLAnchorElement | null>;
}) {
  const Icon = item.icon;
  const icon = <Icon aria-hidden className="hidden size-5 shrink-0 lg:block" />;

  if (item.href === null) {
    // Страницы ещё нет: не ссылка и не в порядке табуляции, но озвучивается как недоступная.
    return (
      <span
        role="link"
        aria-disabled="true"
        className={cn(ITEM_CLASS, "w-full bg-card text-muted-foreground lg:bg-transparent")}
      >
        {icon}
        <span className="min-w-0 truncate lg:flex-1">{item.label}</span>
        {/* `text-foreground`: `muted-foreground` на `muted` даёт 4.39:1, меньше 4.5. */}
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground">
          {ACCOUNT_NAV_TEXT.soon}
        </span>
      </span>
    );
  }

  const active = isAccountNavItemActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      ref={active ? activeRef : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        ITEM_CLASS,
        "w-full",
        active
          ? "bg-accent font-semibold text-accent-foreground"
          : "bg-card text-foreground hover:bg-muted lg:bg-transparent lg:hover:bg-muted",
      )}
    >
      {icon}
      <span className="min-w-0 truncate lg:flex-1">{item.label}</span>
    </Link>
  );
}
