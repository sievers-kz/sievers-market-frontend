import type { ReactNode } from "react";

interface CatalogListHeaderProps {
  /** Слева: число найденных объявлений (или полоска скелетона). */
  title: ReactNode;
  /** Справа: переключатель вида, позже сортировка. */
  actions?: ReactNode;
}

/** «Шапка» списка объявлений: белая полоса на всю ширину колонки карточек. */
export function CatalogListHeader({ title, actions }: CatalogListHeaderProps) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 rounded-2xl bg-card px-4 py-2">
      <div className="min-w-0 font-medium">{title}</div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
