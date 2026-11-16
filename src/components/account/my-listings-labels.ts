import type { MyListingsSort, MyListingsStatus } from "@/lib/api";

/** Тексты «Моих объявлений»: docs/pages/my-listings.md. */
export const MY_LISTINGS_TEXT = {
  pageTitle: "Мои объявления",
  postListing: "Подать объявление",

  statusGroupLabel: "Статус объявления",
  statusAll: "Все",

  organizationLabel: "Организация",
  organizationAll: "Все организации",
  organizationFallback: "Организация",
  categoryLabel: "Категория",
  categoryAll: "Все категории",
  sortLabel: "Сортировка",

  untitled: "Без названия",
  organizationPrefix: "Организация:",
  noPrice: "Цена не указана",

  loading: "Загружаем объявления",
  emptyTitle: "У вас пока нет объявлений",
  empty: "Подайте первое объявление, и оно появится здесь.",
  notFoundTitle: "Ничего не найдено",
  notFound: "Попробуйте изменить фильтры.",
  resetFilters: "Сбросить фильтры",
  listError: "Не удалось загрузить объявления. Проверьте подключение и попробуйте ещё раз.",
  retry: "Повторить",
  pageError: "Не удалось открыть объявления",
} as const;

/** Вкладки статусов в порядке показа; `undefined` — «Все». */
export const MY_LISTINGS_STATUS_TABS: ReadonlyArray<{
  value: MyListingsStatus | undefined;
  label: string;
}> = [
  { value: undefined, label: MY_LISTINGS_TEXT.statusAll },
  { value: "active", label: "Активные" },
  { value: "inactive", label: "Неактивные" },
  { value: "archived", label: "Архив" },
];

/** Подпись чипа статуса на карточке. */
export const MY_LISTING_STATUS_LABELS: Record<MyListingsStatus, string> = {
  active: "Активное",
  inactive: "Неактивное",
  archived: "Архив",
};

export const MY_LISTINGS_SORT_OPTIONS: ReadonlyArray<{ value: MyListingsSort; label: string }> = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
];
