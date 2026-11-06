import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ListingBreadcrumbsProps {
  subcategoryName: string;
}

/**
 * Рубрики и категории в ответе объявления нет (backend#217), поэтому только так.
 * «Каталог» — текст: своей страницы у него ещё нет.
 */
export function ListingBreadcrumbs({ subcategoryName }: ListingBreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-primary">
            Главная
          </Link>
        </li>
        <li className="flex items-center gap-1">
          <ChevronRight className="size-4" aria-hidden />
          <span>Каталог</span>
        </li>
        <li className="flex items-center gap-1">
          <ChevronRight className="size-4" aria-hidden />
          <span aria-current="page" className="text-foreground">
            {subcategoryName}
          </span>
        </li>
      </ol>
    </nav>
  );
}
