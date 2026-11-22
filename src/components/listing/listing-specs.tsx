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
 * по нижней границе последнего ряда сетки, который целиком влезает в предел.
 */
const COLLAPSED_LIMIT = 6 * 24;

interface SpecsCut {
  /** Высота свёрнутого блока: низ последнего целого ряда полей. */
  height: number;
  overflows: boolean;
}

/**
 * Низ каждого ряда сетки: поля одного ряда стоят на одном `offsetTop`, низ ряда — самое
 * высокое из них (соседнее значение могло перенестись на две строки).
 */
function rowBottoms(content: HTMLElement): number[] {
  const bottoms = new Map<number, number>();
  for (const field of content.querySelectorAll<HTMLElement>("[data-spec-field]")) {
    const top = field.offsetTop;
    bottoms.set(top, Math.max(bottoms.get(top) ?? 0, top + field.offsetHeight));
  }
  return [...bottoms.values()].sort((a, b) => a - b);
}

function measureSpecsCut(content: HTMLElement): SpecsCut {
  let height = 0;
  for (const bottom of rowBottoms(content)) {
    if (bottom > COLLAPSED_LIMIT && height > 0) break;
    height = bottom;
    if (bottom > COLLAPSED_LIMIT) break; // Первый ряд выше предела: показываем его целиком.
  }
  return { height, overflows: content.scrollHeight > height + 1 };
}

/**
 * «Характеристики»: группы с заголовками, внутри поля сеткой (две колонки с `md`): подпись
 * сверху, значение снизу, по рядам в порядке `specs`. Длинный блок свёрнут по целому ряду, «Показать все» / «Свернуть». Ссылка
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
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              {group.items.map((item) => (
                <div key={item.key} data-spec-field className="flex min-w-0 flex-col gap-1">
                  <dt className="text-sm break-words text-muted-foreground">{item.label}</dt>
                  <dd className="font-medium break-words">{formatSpecValue(item)}</dd>
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
