import { Building2, FileText, Heart, User, type LucideIcon } from "lucide-react";

/**
 * Пункты навигации личного кабинета: docs/pages/account-layout.md.
 * `href: null` значит, что страницы ещё нет: пункт показывается неактивным с пометкой «Скоро».
 */
export interface AccountNavItem {
  label: string;
  href: string | null;
  icon: LucideIcon;
  /** Активен только при точном совпадении пути: у `/account` под ним лежит весь кабинет. */
  exact?: boolean;
}

/** Группа пунктов; между группами в сайдбаре рисуется разделитель. */
export type AccountNavGroup = AccountNavItem[];

export const ACCOUNT_NAV_GROUPS: AccountNavGroup[] = [
  [
    { label: "Аккаунт", href: "/account", icon: User, exact: true },
    { label: "Мои организации", href: "/account/organizations", icon: Building2 },
    { label: "Мои объявления", href: "/account/listings", icon: FileText },
    { label: "Избранное", href: null, icon: Heart },
  ],
];

export const ACCOUNT_NAV_TEXT = {
  ariaLabel: "Личный кабинет",
  soon: "Скоро",
} as const;

/** Активен пункт, если путь совпадает с `href` или (кроме `exact`) лежит под ним. */
export function isAccountNavItemActive(
  pathname: string,
  href: string,
  exact = false,
): boolean {
  return pathname === href || (!exact && pathname.startsWith(`${href}/`));
}
