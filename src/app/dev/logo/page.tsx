import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LogoPreviewGuestActionsOnPrimary } from "@/components/dev-logo/logo-preview-guest-actions-on-primary";
import { LogoPreviewImage } from "@/components/dev-logo/logo-preview-image";
import { LogoPreviewNavHeader } from "@/components/dev-logo/logo-preview-nav-header";
import { LogoPreviewLightTwoTierHeader } from "@/components/dev-logo/logo-preview-light-two-tier-header";
import { LogoPreviewOneTierHeader } from "@/components/dev-logo/logo-preview-one-tier-header";
import { LogoPreviewRow } from "@/components/dev-logo/logo-preview-row";
import { LogoPreviewSingleHeader } from "@/components/dev-logo/logo-preview-single-header";
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

const SINGLE_NOTE =
  "Одноуровневая шапка: логотип и кнопки гостя. На телефоне только «Войти» (как в текущей шапке).";

const OUTLINED_SRC = "/brand/sievers-logo-header-outlined.svg";
const OUTLINED_WHITE_SRC = "/brand/sievers-logo-header-outlined-white.svg";

/** Временная страница сравнения логотипов (только вне production). Удалить вместе с `components/dev-logo/`. */
export default function DevLogoPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex-1">
      <LogoPreviewRow
        index={13}
        title="Разделы по центру, гость: логотип h-6 | Каталог ▾, Организации, О нас, Поддержка | поиск, Подать, Войти"
        note="«Каталог» открывает панель-заглушку по наведению, клику и с клавиатуры (Radix NavigationMenu), закрывается при уходе курсора и по Esc. Ссылки «О нас», «Поддержка» и категории ведут на #. Иконка поиска и бургер только для вида. Ниже lg только логотип и бургер."
        header={
          <LogoPreviewNavHeader
            variant="guest"
            logo={<LogoPreviewImage src={OUTLINED_SRC} {...OUTLINED} className="h-6" />}
          />
        }
      />
      <LogoPreviewRow
        index={14}
        title="Разделы по центру, после входа: … | поиск, Подать, Личный кабинет"
        note="То же, что строка 13, вместо «Войти» одна контурная кнопка «Личный кабинет» (ведёт на /account). На 1024–1279 у неё только иконка: с текстом ряд не помещается."
        header={
          <LogoPreviewNavHeader
            variant="user"
            logo={<LogoPreviewImage src={OUTLINED_SRC} {...OUTLINED} className="h-6" />}
          />
        }
      />
      <LogoPreviewRow
        index={11}
        title="Один ярус: логотип h-6 | Каталог | поиск | Организации | Подать | Войти | Регистрация"
        note="Кнопки и поиск h-10, «Каталог» призрак (только вид, меню не открывает). Ниже lg только логотип и бургер. «Регистрация» с xl (1280): на 1024 с ней поиск сжался бы до ≈136 px. На 1280 всё в ряд, поиск ≈392 px."
        header={
          <LogoPreviewOneTierHeader
            logo={<LogoPreviewImage src={OUTLINED_SRC} {...OUTLINED} className="h-6" />}
          />
        }
      />
      <LogoPreviewRow
        index={12}
        title="Два яруса, лёгкий нижний: логотип h-6 + Организации, Войти, Регистрация / Каталог, поиск, Подать"
        note="Нижний ярус h-10, «Каталог» призрак (только вид). Ниже md только логотип и бургер (бургер только вид)."
        header={
          <LogoPreviewLightTwoTierHeader
            logo={<LogoPreviewImage src={OUTLINED_SRC} {...OUTLINED} className="h-6" />}
          />
        }
      />
      <LogoPreviewRow
        index={7}
        title="Одноуровневая, header-outlined, h-6 (≈165×24), белый фон"
        note={SINGLE_NOTE}
        header={
          <LogoPreviewSingleHeader
            logo={<LogoPreviewImage src={OUTLINED_SRC} {...OUTLINED} className="h-6" />}
          />
        }
      />
      <LogoPreviewRow
        index={8}
        title="Одноуровневая, header-outlined, h-8 (≈221×32), белый фон"
        note={SINGLE_NOTE}
        header={
          <LogoPreviewSingleHeader
            logo={<LogoPreviewImage src={OUTLINED_SRC} {...OUTLINED} className="h-8" />}
          />
        }
      />
      <LogoPreviewRow
        index={9}
        title="Одноуровневая, header-outlined, h-10 (≈276×40, по высоте кнопок), белый фон"
        note={`${SINGLE_NOTE} На телефоне логотип h-8: при h-10 (276 px) вместе с «Войти» ряд не помещается в 375.`}
        header={
          <LogoPreviewSingleHeader
            logo={<LogoPreviewImage src={OUTLINED_SRC} {...OUTLINED} className="h-8 md:h-10" />}
          />
        }
      />
      <LogoPreviewRow
        index={10}
        title="Одноуровневая, header-outlined-white, h-8 (≈221×32), фон bg-primary"
        note={`${SINGLE_NOTE} Кнопки перекрашены: «Войти» белая рамка и текст, «Регистрация» белая заливка, текст primary.`}
        header={
          <LogoPreviewSingleHeader
            className="bg-primary"
            logo={<LogoPreviewImage src={OUTLINED_WHITE_SRC} {...OUTLINED} className="h-8" />}
            actions={<LogoPreviewGuestActionsOnPrimary />}
          />
        }
      />
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
