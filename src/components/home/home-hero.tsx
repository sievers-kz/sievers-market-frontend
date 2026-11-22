import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PostListingButton } from "@/components/layout/post-listing-button";
import { cn } from "@/lib/utils";

import { HeroChips } from "./hero-chips";
import { HeroLines } from "./hero-lines";
import { HeroSearch } from "./hero-search";

interface HomeHeroProps {
  /** Первая категория рубрики «Техника» (`HERO_CATALOG_RUBRIC`); `null` — кнопки каталога нет. */
  catalogHref: string | null;
  chips: readonly { label: string; href: string }[];
}

const OUTLINE_LINK_CLASS =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md border border-primary px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/**
 * Hero главной (`docs/pages/home.md`, раздел 1). Десктоп (`xl`+) раскладывается по холсту 1440
 * от центра, чтобы совпадать с вершиной V в SVG; ниже `xl` одна колонка.
 */
export function HomeHero({ catalogHref, chips }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* Десктоп */}
      <div className="hidden xl:block">
        <HeroLines variant="desktop" />
        <div className="relative left-1/2 h-[560px] w-[1440px] -translate-x-1/2">
          <p className="absolute top-20 left-[176px] text-[13px]/5 font-semibold tracking-[1.5px] text-primary">
            МАРКЕТПЛЕЙС СЕЛЬХОЗТЕХНИКИ
          </p>
          <p className="absolute top-20 right-[176px] text-right text-[13px]/5 font-semibold tracking-[1.5px] text-primary">
            СДЕЛКИ НАПРЯМУЮ ПО ВСЕМУ КАЗАХСТАНУ
          </p>

          <div className="absolute top-[176px] left-[176px] w-[416px]">
            <h1 className="text-[32px]/10 font-bold">Покупайте напрямую</h1>
            <p className="mt-2 text-base text-foreground/80">
              Техника и оборудование от организаций со всей страны
            </p>
            {catalogHref && (
              <Link href={catalogHref} className={cn(OUTLINE_LINK_CLASS, "mt-4")}>
                Смотреть каталог
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            )}
          </div>

          <div className="absolute top-[176px] right-[176px] flex w-[400px] flex-col items-end text-right">
            <h2 className="text-[28px]/9 font-bold whitespace-nowrap">Продавайте в любой регион</h2>
            <p className="mt-2 text-base text-foreground/80">
              Добавьте организацию, разместите объявление, и покупатели найдут его в каталоге
            </p>
            <PostListingButton variant="primary" className="mt-4" />
          </div>

          <HeroSearch size="desktop" className="absolute top-[376px] left-1/2 w-[640px] -translate-x-1/2" />
          <HeroChips
            chips={chips}
            className="absolute top-[456px] left-1/2 w-[640px] -translate-x-1/2 justify-center"
          />
        </div>
      </div>

      {/* Телефон и планшет */}
      <div className="relative px-4 py-8 xl:hidden">
        <HeroLines variant="mobile" />
        <div className="relative mx-auto max-w-[640px]">
          <p className="text-[11px]/4 font-semibold tracking-[1.2px] text-primary">
            МАРКЕТПЛЕЙС СЕЛЬХОЗТЕХНИКИ
          </p>
          {/* Второй h1 в DOM, но в каждый момент виден один: блоки переключаются `display: none`. */}
          <h1 className="mt-2 text-[28px]/9 font-bold tracking-tight">
            Покупайте и продавайте
            <br />
            напрямую
          </h1>
          <div aria-hidden="true" className="h-[168px]" />
          <HeroSearch size="mobile" />
          {chips.length > 0 && (
            <div className="scrollbar-none -mx-4 mt-4 overflow-x-auto px-4">
              <HeroChips chips={chips} />
            </div>
          )}
          <div className="mt-6 grid grid-cols-2 gap-2">
            {catalogHref && (
              <Link href={catalogHref} className={cn(OUTLINE_LINK_CLASS, "px-4")}>
                Каталог
              </Link>
            )}
            <PostListingButton variant="primary" className={catalogHref ? undefined : "col-span-2"} />
          </div>
        </div>
      </div>
    </section>
  );
}
