/** Текстовые разделы шапки после «Каталога» (центр с `lg`, ниже — в мобильном меню). */
export const HEADER_NAV_LINKS = [
  { label: "Организации", href: "/organizations" },
  { label: "О нас", href: "/about" },
  { label: "Поддержка", href: "/support" },
] as const;

/** Пункт активен на своей странице и на вложенных (`/catalog/…` для «Каталога»). */
export function isHeaderNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
