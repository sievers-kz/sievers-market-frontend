"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ListingDescriptionProps {
  text: string;
  className?: string;
}

/**
 * Текст длиннее 6 строк сворачивается. Переполнение меряем по факту вёрстки
 * (`scrollHeight > clientHeight`), а не по длине строки. Высоту блока не задаём.
 */
export function ListingDescription({ text, className }: ListingDescriptionProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || expanded) return;
    const measure = () =>
      setOverflows(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [expanded]);

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
