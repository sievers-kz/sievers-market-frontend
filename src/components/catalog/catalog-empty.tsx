import { PackageOpen, SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface CatalogEmptyProps {
  /** Ссылка «Сбросить фильтры»: пусто из-за фильтров, а не потому что объявлений нет. */
  resetHref?: string;
  /** Текст поиска (`/search`): без фильтров пусто «по запросу», со ссылкой в каталог. */
  query?: string;
}

export function CatalogEmpty({ resetHref, query }: CatalogEmptyProps) {
  if (resetHref) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-16 text-center">
        <SearchX className="size-12 text-muted-foreground" aria-hidden />
        <p className="text-lg font-medium">По выбранным фильтрам ничего не нашлось</p>
        <Button asChild variant="outline">
          <Link href={resetHref}>Сбросить фильтры</Link>
        </Button>
      </div>
    );
  }

  if (query !== undefined) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-16 text-center">
        <SearchX className="size-12 text-muted-foreground" aria-hidden />
        <p className="text-lg font-medium wrap-anywhere">
          По запросу «{query}» ничего не нашлось
        </p>
        {/* Страницы `/catalog` без id нет: каталог открывается мега-меню, ведём на главную. */}
        <Button asChild variant="outline">
          <Link href="/">Перейти в каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-16 text-center">
      <PackageOpen className="size-12 text-muted-foreground" aria-hidden />
      <p className="text-lg font-medium">В этой категории пока нет объявлений</p>
    </div>
  );
}
