import { CatalogFilterForm, type CatalogFilterFormProps } from "./catalog-filter-form";

/** Панель «Фильтры» в сайдбаре под подкатегориями, только с `lg` (ниже — диалог). */
export function CatalogFilterPanel(props: Omit<CatalogFilterFormProps, "onNavigate">) {
  return (
    <section aria-labelledby="catalog-filters-title" className="hidden rounded-2xl bg-card p-6 lg:block">
      <h2 id="catalog-filters-title" className="mb-4 text-lg font-semibold">
        Фильтры
      </h2>
      <CatalogFilterForm {...props} />
    </section>
  );
}
