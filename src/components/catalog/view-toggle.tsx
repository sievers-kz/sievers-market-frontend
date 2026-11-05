import { LayoutGrid, List, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  buildCatalogHref,
  type CatalogParams,
  type CatalogView,
} from "./search-params";

interface ViewToggleProps {
  categoryId: string;
  params: CatalogParams;
}

const OPTIONS: { view: CatalogView; label: string; icon: LucideIcon }[] = [
  { view: "grid", label: "Плиткой", icon: LayoutGrid },
  { view: "list", label: "Списком", icon: List },
];

export function ViewToggle({ categoryId, params }: ViewToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-card p-1" role="group" aria-label="Вид списка">
      {OPTIONS.map(({ view, label, icon: Icon }) => {
        const isActive = params.view === view;
        return (
          <Link
            key={view}
            href={buildCatalogHref(categoryId, { ...params, view })}
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
            title={label}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </Link>
        );
      })}
    </div>
  );
}
