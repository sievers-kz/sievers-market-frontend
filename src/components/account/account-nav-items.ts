import { Building2, FileText, Heart, User, type LucideIcon } from "lucide-react";

/**
 * Пункты навигации личного кабинета: docs/pages/account-layout.md.
 * `href: null` значит, что страницы ещё нет: пункт показывается неактивным с пометкой «Скоро».
 */
export interface AccountNavItem {
  label: string;
  href: string | null;
  icon: LucideIcon;
}

/** Группа пунктов; между группами в сайдбаре рисуется разделитель. */
export type AccountNavGroup = AccountNavItem[];

export const ACCOUNT_NAV_GROUPS: AccountNavGroup[] = [
  [
    { label: "Мои организации", href: "/account/organizations", icon: Building2 },
    { label: "Мои объявления", href: null, icon: FileText },
    { label: "Избранное", href: null, icon: Heart },
    { label: "Профиль", href: null, icon: User },
  ],
];

export const ACCOUNT_NAV_TEXT = {
  ariaLabel: "Личный кабинет",
  soon: "Скоро",
} as const;

/** Активен пункт, если путь совпадает с `href` или лежит под ним. */
export function isAccountNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
