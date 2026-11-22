import Link from "next/link";

import { CONTACT_EMAIL, CONTACT_TELEGRAM_LABEL, CONTACT_TELEGRAM_URL } from "@/lib/site";

import { Container } from "./container";
import { SiteLogo } from "./site-logo";

/** Разделы футера. «Каталога» нет: общей страницы `/catalog` без id нет. */
const FOOTER_LINKS = [
  { href: "/organizations", label: "Организации" },
  { href: "/about", label: "О нас" },
  { href: "/support", label: "Поддержка" },
  { href: "/terms", label: "Условия" },
  { href: "/privacy", label: "Конфиденциальность" },
] as const;

const LINK_CLASS =
  "rounded-sm text-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** Футер всех страниц группы `(site)` (`docs/pages/home.md`, раздел 6). Вход и регистрация без него. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="grid grid-cols-[1fr_1.5fr] gap-6 py-12 md:grid-cols-[2fr_1fr_1fr] md:gap-8">
        <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-1">
          <SiteLogo />
          <p className="max-w-[320px] text-sm text-muted-foreground">
            Маркетплейс для агробизнеса в Казахстане
          </p>
        </div>

        <nav aria-labelledby="site-footer-sections">
          <h2 id="site-footer-sections" className="text-sm font-semibold">
            Разделы
          </h2>
          <ul className="mt-4 flex flex-col items-start gap-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Контакты</h2>
          <ul className="mt-4 flex flex-col items-start gap-2">
            <li>
              <a href={CONTACT_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                Telegram: {CONTACT_TELEGRAM_LABEL}
              </a>
            </li>
            <li className="max-w-full">
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${LINK_CLASS} [overflow-wrap:anywhere]`}>
                Почта: {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-4">
          <p className="text-center text-[13px]/4 text-muted-foreground">© 2026 Sievers</p>
        </Container>
      </div>
    </footer>
  );
}
