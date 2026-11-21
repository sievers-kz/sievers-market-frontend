"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { parseSearchText } from "@/components/catalog/search-params";

import { HeaderSearchForm } from "./header-search-form";

/** На `/search` поле показывает текущий `q`; новый запрос пересоздаёт поле (`key`). */
interface HeaderSearchProps {
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

function HeaderSearchWithQuery({ autoFocus, onSubmitted }: HeaderSearchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const text = pathname === "/search" ? (parseSearchText(searchParams.get("q") ?? undefined) ?? "") : "";
  return <HeaderSearchForm key={text} initialText={text} autoFocus={autoFocus} onSubmitted={onSubmitted} />;
}

/**
 * Поиск в шапке. `useSearchParams` на статической странице рендерится только в браузере
 * до ближайшего `Suspense`, поэтому граница здесь, вокруг поля: остальная шапка остаётся
 * в статическом HTML, а в нём само поле пустое (fallback).
 */
export function HeaderSearch({ autoFocus, onSubmitted }: HeaderSearchProps) {
  return (
    <Suspense fallback={<HeaderSearchForm initialText="" autoFocus={autoFocus} onSubmitted={onSubmitted} />}>
      <HeaderSearchWithQuery autoFocus={autoFocus} onSubmitted={onSubmitted} />
    </Suspense>
  );
}
