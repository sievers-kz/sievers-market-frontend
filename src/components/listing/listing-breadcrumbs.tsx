import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ListingBreadcrumbsProps {
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
}

const LINK_CLASS = "hover:text-primary";

/**
 * Главная / Каталог / категория / подкатегория. Рубрики в ответе нет. «Каталог» — текст:
 * своей страницы у него ещё нет. Подкатегория — ссылка на каталог категории с выбранной
 * подкатегорией (текущая страница — само объявление).
 */
export function ListingBreadcrumbs({
  categoryId,
  categoryName,
  subcategoryId,
  subcategoryName,
}: ListingBreadcrumbsProps) {
  const categoryHref = `/catalog/${encodeURIComponent(categoryId)}`;
  const subcategoryHref = `${categoryHref}?${new URLSearchParams({ subcategory: subcategoryId })}`;

  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/" className={LINK_CLASS}>
            Главная
          </Link>
        </li>
        <li className="flex items-center gap-1">
          <ChevronRight className="size-4" aria-hidden />
          <span>Каталог</span>
        </li>
        <li className="flex items-center gap-1">
          <ChevronRight className="size-4" aria-hidden />
          <Link href={categoryHref} className={LINK_CLASS}>
            {categoryName}
          </Link>
        </li>
        <li className="flex items-center gap-1">
          <ChevronRight className="size-4" aria-hidden />
          <Link href={subcategoryHref} className={LINK_CLASS}>
            {subcategoryName}
          </Link>
        </li>
      </ol>
    </nav>
  );
}
