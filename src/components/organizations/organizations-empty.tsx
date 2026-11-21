import { SearchX, Store } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { buildOrganizationsHref } from "./search-params";

interface OrganizationsEmptyProps {
  /** Текст поиска: пусто «по запросу», со ссылкой на полный список. Без него каталог пуст. */
  query?: string;
}

export function OrganizationsEmpty({ query }: OrganizationsEmptyProps) {
  if (query) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-16 text-center">
        <SearchX className="size-12 text-muted-foreground" aria-hidden />
        <p className="text-lg font-medium wrap-anywhere">Ничего не найдено по запросу «{query}»</p>
        <Button asChild variant="outline">
          <Link href={buildOrganizationsHref({ page: 1 })}>Сбросить поиск</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-16 text-center">
      <Store className="size-12 text-muted-foreground" aria-hidden />
      <p className="text-lg font-medium">Пока нет организаций в каталоге</p>
    </div>
  );
}
