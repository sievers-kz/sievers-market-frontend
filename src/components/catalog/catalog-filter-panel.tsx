import { CatalogFilterForm, type CatalogFilterFormProps } from "./catalog-filter-form";

/**
 * Фильтры в сайдбаре под подкатегориями, только с `lg` (ниже — диалог). Каждый фильтр в своей
 * карточке; карточка «Показать» / «Сбросить» липкая снизу, чтобы не уезжал при длинном списке.
 */
export function CatalogFilterPanel(props: Omit<CatalogFilterFormProps, "onNavigate">) {
  return (
    <section aria-labelledby="catalog-filters-title" className="hidden lg:flex lg:flex-col">
      <h2 id="catalog-filters-title" className="sr-only">
        Фильтры
      </h2>
      <CatalogFilterForm {...props} actionsClassName="sticky bottom-0 z-10 mt-4" />
    </section>
  );
}
