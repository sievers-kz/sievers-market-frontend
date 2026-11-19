"use client";

import { useRef, useState } from "react";

import { measureClampOverflow, useResizeMeasure } from "@/hooks/use-resize-measure";
import { cn } from "@/lib/utils";

interface ListingDescriptionProps {
  text: string;
  className?: string;
}

/**
 * Текст длиннее 6 строк сворачивается. Переполнение меряем по факту вёрстки
 * (`useResizeMeasure`, `scrollHeight > clientHeight`), а не по длине строки.
 */
export function ListingDescription({ text, className }: ListingDescriptionProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  // Пока раскрыто, не меряем (обрезки нет): остаётся значение из свёрнутого вида.
  const overflows = useResizeMeasure(ref, measureClampOverflow, !expanded) ?? false;

  return (
    <section
      className={cn("flex flex-col gap-4 rounded-2xl bg-card p-6", className)}
    >
      <h2 className="text-xl font-semibold">Описание</h2>
      <p
        ref={ref}
        className={cn(
          "break-words whitespace-pre-line",
          !expanded && "line-clamp-6",
        )}
      >
        {text}
      </p>
      {(overflows || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="self-start text-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {expanded ? "Свернуть" : "Показать больше"}
        </button>
      )}
    </section>
  );
}
