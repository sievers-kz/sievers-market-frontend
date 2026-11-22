import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { HomeRubric } from "./home-rubrics";

interface RubricTileProps {
  rubric: HomeRubric;
  /** Рубрика есть в `getCategoryTree()`; иначе заглушка «Скоро». */
  active: boolean;
  /** Первая категория рубрики; у активной без категорий `null`: плитка без ссылки и «Смотреть». */
  href: string | null;
  /** Телефон: активная плитка горизонтальная на всю ширину. */
  className?: string;
}

/**
 * Плитка рубрики на главной. Активная — ссылка; заглушка — `div` с пунктирной рамкой и меткой «Скоро».
 * Вертикальная везде, кроме активной на телефоне (< `sm`): там иконка слева и стрелка справа.
 */
export function RubricTile({ rubric, active, href, className }: RubricTileProps) {
  const Icon = rubric.icon;

  if (!active) {
    return (
      <div
        className={cn(
          "flex flex-col items-start gap-4 rounded-2xl border border-dashed border-border bg-muted/50 p-4 sm:p-6",
          className,
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground sm:size-14">
          <Icon aria-hidden className="size-5 sm:size-6" />
        </span>
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-base font-semibold text-foreground/80 sm:text-lg/[26px]">{rubric.name}</h3>
          <p className="hidden text-sm text-muted-foreground sm:block">{rubric.description}</p>
          <span className="rounded-sm bg-muted px-2 text-xs/4 text-muted-foreground">Скоро</span>
        </div>
      </div>
    );
  }

  const content = (
    <>
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon aria-hidden className="size-6" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-lg/[26px] font-semibold">{rubric.name}</h3>
        <p className="text-sm text-muted-foreground">{rubric.description}</p>
        {href && (
          <span className="hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">
            Смотреть
            <ArrowRight aria-hidden className="size-4" />
          </span>
        )}
      </div>
      {href && <ArrowRight aria-hidden className="size-5 shrink-0 text-primary sm:hidden" />}
    </>
  );
  const tileClass =
    "flex items-center gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-col sm:items-start sm:p-6";

  if (!href) return <div className={cn(tileClass, className)}>{content}</div>;

  return (
    <Link
      href={href}
      className={cn(
        tileClass,
        "transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      {content}
    </Link>
  );
}
