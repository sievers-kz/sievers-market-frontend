"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  buildCatalogHref,
  scopeSorts,
  type CatalogParams,
  type CatalogScope,
  type CatalogSort,
} from "./search-params";

/** Значение пункта «без сортировки»: Radix Select не принимает пустую строку. */
const DEFAULT_VALUE = "default";

const SORT_LABELS: Record<CatalogSort, string> = {
  newest: "Сначала новые",
  price_asc: "Сначала дешевле",
  price_desc: "Сначала дороже",
};

/** Подпись порядка по умолчанию (без `sort` в URL). */
const DEFAULT_LABELS: Record<CatalogScope["kind"], string> = {
  category: SORT_LABELS.newest,
  search: "По релевантности",
};

interface CatalogSortSelectProps {
  scope: CatalogScope;
  params: CatalogParams;
}

/**
 * Сортировка сразу пишет URL (страница 1). Первый пункт — порядок по умолчанию, без параметра:
 * в каталоге «Сначала новые», в поиске «По релевантности» (бэкенд без `sort` при тексте
 * сортирует по релевантности).
 */
export function CatalogSortSelect({ scope, params }: CatalogSortSelectProps) {
  const router = useRouter();
  const sorts = scopeSorts(scope.kind);
  const options = [
    { value: DEFAULT_VALUE, label: DEFAULT_LABELS[scope.kind] },
    ...sorts.map((sort) => ({ value: sort, label: SORT_LABELS[sort] })),
  ];

  return (
    <Select
      value={params.sort ?? DEFAULT_VALUE}
      onValueChange={(value) => {
        const sort = sorts.find((item) => item === value);
        router.push(buildCatalogHref(scope, { ...params, sort, page: 1 }), { scroll: false });
      }}
    >
      <SelectTrigger aria-label="Сортировка" className="min-w-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
