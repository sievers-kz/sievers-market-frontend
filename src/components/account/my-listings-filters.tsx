"use client";

import { useEffect, useRef } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryTree } from "@/lib/api/catalog";
import type { MyListingsStatus, OrganizationListItem } from "@/lib/api";
import { cn } from "@/lib/utils";

import {
  MY_LISTINGS_SORT_OPTIONS,
  MY_LISTINGS_STATUS_TABS,
  MY_LISTINGS_TEXT,
} from "./my-listings-labels";
import type { MyListingsParams } from "./my-listings-search-params";

/** Radix Select не принимает пустое значение: «все» — отдельный ключ. */
const ALL = "all";

export type MyListingsFilterChange = Partial<
  Pick<MyListingsParams, "status" | "organizationId" | "categoryId" | "sort">
>;

interface MyListingsFiltersProps {
  params: MyListingsParams;
  organizations: readonly OrganizationListItem[];
  tree: CategoryTree;
  onChange: (change: MyListingsFilterChange) => void;
}

function organizationLabel(organization: OrganizationListItem): string {
  return organization.shop_name || organization.legal_name || MY_LISTINGS_TEXT.organizationFallback;
}

function StatusTabs({
  value,
  onChange,
}: {
  value: MyListingsStatus | undefined;
  onChange: (status: MyListingsStatus | undefined) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // На телефоне строка прокручивается: выбранная вкладка видна сразу после загрузки.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = activeRef.current;
    if (!scroller || !active || scroller.scrollWidth <= scroller.clientWidth) return;
    active.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
    // Только при загрузке: при выборе вкладка и так под пальцем.
  }, []);

  return (
    <div
      ref={scrollerRef}
      role="group"
      aria-label={MY_LISTINGS_TEXT.statusGroupLabel}
      className={cn(
        // `-m-1 p-1`: кольцо фокуса не обрезается прокруткой.
        "-m-1 flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible",
      )}
    >
      {MY_LISTINGS_STATUS_TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.label}
            ref={selected ? activeRef : undefined}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex h-10 shrink-0 items-center justify-center rounded-lg border px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-12",
              selected
                ? "border-primary bg-accent text-primary"
                : "border-transparent bg-muted text-foreground hover:bg-accent",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Панель фильтров: вкладки статусов и три списка (организация, категория, сортировка).
 * Состояние живёт в URL, компонент только сообщает об изменении.
 */
export function MyListingsFilters({ params, organizations, tree, onChange }: MyListingsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 sm:p-6">
      <StatusTabs value={params.status} onChange={(status) => onChange({ status })} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Показывается всегда, при любом числе организаций (даже при одной или сбое загрузки). */}
        <Select
          value={params.organizationId ?? ALL}
          onValueChange={(value) =>
            onChange({ organizationId: value === ALL ? undefined : value })
          }
        >
          <SelectTrigger aria-label={MY_LISTINGS_TEXT.organizationLabel} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value={ALL}>{MY_LISTINGS_TEXT.organizationAll}</SelectItem>
            {organizations.map((organization) => (
              <SelectItem key={organization.id} value={organization.id}>
                <span className="truncate">{organizationLabel(organization)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={params.categoryId ?? ALL}
          onValueChange={(value) => onChange({ categoryId: value === ALL ? undefined : value })}
        >
          <SelectTrigger aria-label={MY_LISTINGS_TEXT.categoryLabel} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value={ALL}>{MY_LISTINGS_TEXT.categoryAll}</SelectItem>
            {tree.map((rubric) => (
              <SelectGroup key={rubric.id}>
                <SelectLabel>{rubric.name}</SelectLabel>
                {rubric.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="truncate">{category.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={params.sort}
          onValueChange={(value) => {
            const sort = MY_LISTINGS_SORT_OPTIONS.find((option) => option.value === value)?.value;
            if (sort) onChange({ sort });
          }}
        >
          <SelectTrigger aria-label={MY_LISTINGS_TEXT.sortLabel} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {MY_LISTINGS_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
