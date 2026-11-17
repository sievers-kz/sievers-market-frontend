import type { ListingStatusAction, MyListingsSort, MyListingsStatus } from "@/lib/api";

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

  // Действия над объявлением: docs/pages/my-listings-actions.md.
  actions: "Действия с объявлением",
  deleteTitle: "Удалить объявление?",
  deleteDescription:
    "Объявление исчезнет из каталога и из вашего списка. Восстановить его сейчас нельзя.",
  deleteCancel: "Отмена",
  deletePending: "Удаляем…",
  listingGone: "Объявление не найдено. Список обновлён.",
  actionFailed: "Не удалось выполнить действие. Попробуйте ещё раз.",
  closeNotice: "Закрыть сообщение",
} as const;

/** Пункты меню «⋯» и сообщения об успехе. */
export const MY_LISTING_ACTION_TEXT: Record<
  ListingStatusAction,
  { label: string; done: string }
> = {
  activate: { label: "Активировать", done: "Объявление активировано" },
  deactivate: { label: "Деактивировать", done: "Объявление деактивировано" },
  archive: { label: "В архив", done: "Объявление перемещено в архив" },
  delete: { label: "Удалить", done: "Объявление удалено" },
};

/** Пункты меню по статусу карточки, сверху вниз, без «Удалить» (он всегда последний). */
export const MY_LISTING_STATUS_ACTIONS: Record<
  MyListingsStatus,
  ReadonlyArray<Exclude<ListingStatusAction, "delete">>
> = {
  active: ["deactivate", "archive"],
  inactive: ["activate", "archive"],
  archived: ["activate"],
};

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
