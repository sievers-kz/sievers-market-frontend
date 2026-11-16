import type { Metadata } from "next";
import { Suspense } from "react";

import { MyListingsSkeleton } from "@/components/account/my-listings-skeleton";
import { MyListingsView } from "@/components/account/my-listings-view";
import { getCategoryTree } from "@/lib/api";

export const metadata: Metadata = {
  title: "Мои объявления",
  robots: { index: false },
};

/**
 * Дерево категорий (для фильтра) читается на сервере с кэшем; вход, список и организации
 * проверяет клиент (`MyListingsView`): на сервере токен не обновляется. `Suspense` нужен
 * для `useSearchParams`. `<main>` и `Container` рисует каркас кабинета.
 */
export default async function MyListingsPage() {
  const tree = await getCategoryTree();

  return (
    <Suspense fallback={<MyListingsSkeleton />}>
      <MyListingsView tree={tree} />
    </Suspense>
  );
}
