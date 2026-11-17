import type { ReactNode } from "react";

/**
 * Заголовок страницы кабинета: строка на сером фоне без карточки, справа действие
 * (на телефоне под заголовком на всю ширину). Ставится первым элементом страницы.
 */
export function AccountPageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="min-w-0 text-2xl font-semibold break-words lg:text-3xl">{title}</h1>
      {action}
    </div>
  );
}
