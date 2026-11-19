"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useResizeMeasure } from "@/hooks/use-resize-measure";
import type { ListingSpecGroup } from "@/lib/api";
import { cn } from "@/lib/utils";

import {
  formatSpecValue,
  LISTING_SPECS_EXPAND_EVENT,
  LISTING_SPECS_ID,
} from "./listing-spec-format";

interface ListingSpecsProps {
  /** Готовые к показу характеристики из `specs`: группы и строки в порядке формы. */
  groups: readonly ListingSpecGroup[];
  className?: string;
}

/**
 * Предел свёрнутого блока: примерно 6 строк описания (`text-base`, строка 24). Обрезаем
 * по нижней границе последней строки, которая целиком влезает в предел.
 */
const COLLAPSED_LIMIT = 6 * 24;

interface SpecsCut {
  /** Высота свёрнутого блока: низ последней целой строки. */
  height: number;
  overflows: boolean;
}

function measureSpecsCut(content: HTMLElement): SpecsCut {
  const rows = content.querySelectorAll<HTMLElement>("[data-spec-row]");
  let height = 0;
  for (const row of rows) {
    const bottom = row.offsetTop + row.offsetHeight;
    if (bottom > COLLAPSED_LIMIT && height > 0) break;
    height = bottom;
    if (bottom > COLLAPSED_LIMIT) break; // Первая строка выше предела: показываем её целиком.
  }
  return { height, overflows: content.scrollHeight > height + 1 };
}

/**
 * «Характеристики»: группы с заголовками, строки «название — значение единица».
 * Длинный блок свёрнут по целой строке, «Показать все» / «Свернуть». Ссылка
 * «Все характеристики» раскрывает его событием `LISTING_SPECS_EXPAND_EVENT`.
 */
export function ListingSpecs({ groups, className }: ListingSpecsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const cut = useResizeMeasure(contentRef, measureSpecsCut, !expanded);
  const visible = groups.filter((group) => group.items.length > 0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Синхронно: ссылка прокручивает сразу после события, страница должна быть уже
    // полной высоты, иначе прокрутка упрётся в низ свёрнутой страницы.
    const expand = () => flushSync(() => setExpanded(true));
    section.addEventListener(LISTING_SPECS_EXPAND_EVENT, expand);
    // Пришли по ссылке с якорем: раскрываем после первого кадра (адрес есть только в браузере).
    const frame =
      window.location.hash === `#${LISTING_SPECS_ID}`
        ? window.requestAnimationFrame(() => setExpanded(true))
        : 0;
    return () => {
      window.cancelAnimationFrame(frame);
      section.removeEventListener(LISTING_SPECS_EXPAND_EVENT, expand);
    };
  }, []);

  if (visible.length === 0) return null;

  // До первого измерения (сервер, гидрация) режем по пределу, потом по целой строке.
  const collapsed = !expanded && (cut === null || cut.overflows);

  return (
    <section
      ref={sectionRef}
      id={LISTING_SPECS_ID}
      tabIndex={-1}
      aria-labelledby="listing-specs-title"
      className={cn(
        "flex scroll-mt-8 flex-col gap-4 rounded-2xl bg-card p-6 outline-none",
        className,
      )}
    >
      <h2 id="listing-specs-title" className="text-xl font-semibold">
        Характеристики
      </h2>
      <div
        ref={contentRef}
        id="listing-specs-content"
        className={cn("relative flex flex-col gap-6", collapsed && "overflow-hidden")}
        style={collapsed ? { maxHeight: cut?.height || COLLAPSED_LIMIT } : undefined}
      >
        {visible.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            <h3 className="font-semibold">{group.label}</h3>
            <dl className="flex flex-col">
              {group.items.map((item) => (
                <div
                  key={item.key}
                  data-spec-row
                  className="grid min-h-12 grid-cols-2 items-center gap-4 border-b border-border last:border-b-0"
                >
                  <dt className="min-w-0 break-words text-muted-foreground">{item.label}</dt>
                  <dd className="min-w-0 font-medium break-words">{formatSpecValue(item)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      {(expanded || cut?.overflows) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls="listing-specs-content"
          className="self-start text-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {expanded ? "Свернуть" : "Показать все"}
        </button>
      )}
    </section>
  );
}
