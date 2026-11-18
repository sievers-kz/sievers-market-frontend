"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListingSearchSort } from "@/lib/api/listing";

import { buildCatalogHref, CATALOG_SORTS, type CatalogParams } from "./search-params";

const SORT_OPTIONS: readonly { value: ListingSearchSort; label: string }[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
];

interface CatalogSortSelectProps {
  categoryId: string;
  params: CatalogParams;
}

/** Сортировка сразу пишет URL (страница 1). «Сначала новые» по умолчанию: параметра нет. */
export function CatalogSortSelect({ categoryId, params }: CatalogSortSelectProps) {
  const router = useRouter();

  return (
    <Select
      value={params.sort ?? "newest"}
      onValueChange={(value) => {
        const sort = CATALOG_SORTS.find((item) => item === value);
        router.push(buildCatalogHref(categoryId, { ...params, sort, page: 1 }), { scroll: false });
      }}
    >
      <SelectTrigger aria-label="Сортировка" className="min-w-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
