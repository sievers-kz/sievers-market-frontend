"use client";

import { ChevronDown } from "lucide-react";
import type { MouseEvent } from "react";

import { LISTING_SPECS_EXPAND_EVENT, LISTING_SPECS_ID } from "./listing-spec-format";

/**
 * «Все характеристики»: раскрывает блок, если он свёрнут, и плавно прокручивает к нему
 * (без анимации при `prefers-reduced-motion`). Фокус переходит на блок. Без JS работает
 * обычный якорь.
 */
export function ListingSpecsLink() {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(LISTING_SPECS_ID);
    if (!target) return;
    event.preventDefault();
    target.dispatchEvent(new Event(LISTING_SPECS_EXPAND_EVENT));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
  }

  return (
    <a
      href={`#${LISTING_SPECS_ID}`}
      onClick={handleClick}
      className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary hover:underline"
    >
      Все характеристики
      <ChevronDown className="size-4" aria-hidden />
    </a>
  );
}
