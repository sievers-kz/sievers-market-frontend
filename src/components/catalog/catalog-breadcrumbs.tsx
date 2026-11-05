import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CatalogBreadcrumbsProps {
  rubricName: string;
  categoryName: string;
}

/** «Каталог» и рубрика — пока текст: своих страниц у них ещё нет. */
export function CatalogBreadcrumbs({
  rubricName,
  categoryName,
}: CatalogBreadcrumbsProps) {
  const items = ["Каталог", rubricName];

  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-primary">
            Главная
          </Link>
        </li>
        {items.map((item) => (
          <li key={item} className="flex items-center gap-1">
            <ChevronRight className="size-4" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
        <li className="flex items-center gap-1">
          <ChevronRight className="size-4" aria-hidden />
          <span aria-current="page" className="text-foreground">
            {categoryName}
          </span>
        </li>
      </ol>
    </nav>
  );
}
