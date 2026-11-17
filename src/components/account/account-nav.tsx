"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { AccountNavLink } from "./account-nav-link";
import { ACCOUNT_NAV_GROUPS, ACCOUNT_NAV_TEXT } from "./account-nav-items";

/**
 * Навигация кабинета. Один набор разметки: ниже `lg` это строка вкладок
 * с горизонтальной прокруткой до краёв экрана, с `lg` список в карточке сайдбара
 * (карточку рисует `AccountShell`).
 */
export function AccountNav() {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = activeRef.current;
    // Прокручиваем только строку вкладок; сайдбар не переполняется по ширине.
    if (!scroller || !active || scroller.scrollWidth <= scroller.clientWidth) return;
    active.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
  }, [pathname]);

  return (
    <nav aria-label={ACCOUNT_NAV_TEXT.ariaLabel}>
      <div
        ref={scrollerRef}
        className={cn(
          "flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0",
        )}
      >
        {ACCOUNT_NAV_GROUPS.map((group, index) => (
          <ul
            key={index}
            className={cn(
              "flex shrink-0 gap-2 lg:flex-col lg:gap-1",
              index > 0 && "lg:mt-2 lg:border-t lg:border-border lg:pt-2",
            )}
          >
            {group.map((item) => (
              <li key={item.label} className="flex">
                <AccountNavLink
                  item={item}
                  pathname={pathname}
                  activeRef={activeRef}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </nav>
  );
}
