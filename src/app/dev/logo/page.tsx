import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LogoPreviewImage } from "@/components/dev-logo/logo-preview-image";
import { LogoPreviewRow } from "@/components/dev-logo/logo-preview-row";
import { SiteLogo } from "@/components/layout/site-logo";

export const metadata: Metadata = {
  title: "Подбор логотипа",
  robots: { index: false, follow: false },
};

// Пропорции из viewBox файлов в public/brand/.
const OUTLINED = { width: 2039, height: 296 } as const;
const SOLID = { width: 2028, height: 312 } as const;

const PRIMARY_NOTE =
  "Кнопки и ссылки шапки оставлены в текущих цветах: «Каталог», «Регистрация», «Войти» и «Организации» сливаются с фоном primary. Для такой шапки их нужно перекрашивать.";

const H10_NOTE =
  "На 375 px логотип h-10 (276 px) вместе с «Войти» не помещается: ряд шире экрана примерно на 11 px, появляется горизонтальная прокрутка.";

/** Временная страница сравнения логотипов (только вне production). Удалить вместе с `components/dev-logo/`. */
export default function DevLogoPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex-1">
      <LogoPreviewRow
        index={1}
        title="Сейчас: SiteLogo (currentcolor), h-8, белый фон"
        note="Сам SiteLogo на телефоне h-6; здесь h-8 на всех ширинах для сравнения."
        logo={
          <div className="shrink-0 [&_svg]:h-8">
            <SiteLogo />
          </div>
        }
      />
      <LogoPreviewRow
        index={2}
        title="Шапочная версия (header-outlined), h-8, белый фон"
        logo={<LogoPreviewImage src="/brand/sievers-logo-header-outlined.svg" {...OUTLINED} className="h-8" />}
      />
      <LogoPreviewRow
        index={3}
        title="Шапочная версия (header-outlined), h-10, белый фон"
        note={H10_NOTE}
        logo={<LogoPreviewImage src="/brand/sievers-logo-header-outlined.svg" {...OUTLINED} className="h-10" />}
      />
      <LogoPreviewRow
        index={4}
        title="Шапочная версия (header-outlined-white), h-8, фон bg-primary"
        note={PRIMARY_NOTE}
        headerClassName="bg-primary"
        logo={<LogoPreviewImage src="/brand/sievers-logo-header-outlined-white.svg" {...OUTLINED} className="h-8" />}
      />
      <LogoPreviewRow
        index={5}
        title="Шапочная версия (header-outlined-white), h-10, фон bg-primary"
        note={`${PRIMARY_NOTE} ${H10_NOTE}`}
        headerClassName="bg-primary"
        logo={<LogoPreviewImage src="/brand/sievers-logo-header-outlined-white.svg" {...OUTLINED} className="h-10" />}
      />
      <LogoPreviewRow
        index={6}
        title="Цельный (solid), h-8, белый фон"
        logo={<LogoPreviewImage src="/brand/sievers-logo-solid.svg" {...SOLID} className="h-8" />}
      />
    </main>
  );
}
