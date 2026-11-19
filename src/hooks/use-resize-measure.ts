"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

function sameValue<R>(a: R, b: R): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  const keysA = Object.keys(a);
  return (
    keysA.length === Object.keys(b).length &&
    keysA.every((key) => Object.is(a[key as keyof R], b[key as keyof R]))
  );
}

/**
 * Меряет элемент по факту вёрстки: сразу после рендера и при каждом изменении размера
 * (`ResizeObserver`). `measure` должна быть стабильной (функция модуля), иначе наблюдатель
 * пересоздаётся на каждый рендер. Пока `enabled` ложно, не меряет и хранит прошлое значение.
 * До первого измерения `null`. Одинаковый результат (в том числе объект с теми же полями)
 * не вызывает лишний рендер.
 */
export function useResizeMeasure<T extends HTMLElement, R>(
  ref: RefObject<T | null>,
  measure: (element: T) => R,
  enabled = true,
): R | null {
  const [value, setValue] = useState<R | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    const update = () => {
      const next = measure(element);
      setValue((prev) => (prev !== null && sameValue(prev, next) ? prev : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, measure, enabled]);

  return value;
}

/** Обрезан ли текст (`line-clamp`, `max-height`): содержимое выше видимой части. */
export function measureClampOverflow(element: HTMLElement): boolean {
  return element.scrollHeight > element.clientHeight + 1;
}
