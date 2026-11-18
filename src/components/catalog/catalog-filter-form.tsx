"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { BOOLEAN_TRUE, type CityOption, type FilterField } from "./catalog-filter-fields";
import { FilterRadioList } from "./filter-radio-list";
import { PriceInput } from "./price-input";
import {
  buildCatalogHref,
  hasCatalogFilters,
  parsePrice,
  resetCatalogFilters,
  type CatalogFilters,
  type CatalogParams,
} from "./search-params";

export interface CatalogFilterFormProps {
  categoryId: string;
  params: CatalogParams;
  cities: readonly CityOption[] | null;
  /** `null`: подкатегория не выбрана или фильтры не загрузились. */
  fields: readonly FilterField[] | null;
  /** Вызывается после перехода по «Показать» или «Сбросить» (диалог на телефоне закрывается). */
  onNavigate?: () => void;
  /** Классы обёртки карточек и блока кнопок: в диалоге карточки прокручиваются, кнопки снизу. */
  fieldsClassName?: string;
  actionsClassName?: string;
}

function normalizeFormFilters(
  priceMin: string,
  priceMax: string,
  cityId: string,
  attributes: Readonly<Record<string, string>>,
): CatalogFilters {
  let min = parsePrice(priceMin);
  let max = parsePrice(priceMax);
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
  return { priceMin: min, priceMax: max, cityId: cityId || undefined, attributes };
}

function sameAttributes(
  a: CatalogFilters["attributes"] = {},
  b: CatalogFilters["attributes"] = {},
): boolean {
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => Object.hasOwn(b, key) && a[key] === b[key])
  );
}

function sameFilters(a: CatalogFilters, b: CatalogFilters): boolean {
  return (
    a.priceMin === b.priceMin &&
    a.priceMax === b.priceMax &&
    a.cityId === b.cityId &&
    sameAttributes(a.attributes, b.attributes)
  );
}

function priceInput(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

/**
 * Карточка фильтра, как карточка «Категории» (`SubcategoryNav`): белая, `p-4`, заголовок
 * `text-lg font-semibold`. Заголовок — кнопка аккордеона, поля внутри карточки.
 */
function FilterCard({ value, title, children }: { value: string; title: string; children: ReactNode }) {
  return (
    <AccordionItem value={value} className="rounded-2xl border-b-0 bg-card p-4">
      <AccordionTrigger className="items-center py-0 text-lg font-semibold hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-0">{children}</AccordionContent>
    </AccordionItem>
  );
}

/**
 * Форма фильтров каталога: цена, город, атрибуты подкатегории, каждый в своей карточке.
 * Значения живут в форме до «Показать»: каждое применение это запрос на сервер и скелетон
 * списка. Начальные значения из URL; при смене URL форму пересоздаёт `key` у родителя.
 */
export function CatalogFilterForm({
  categoryId,
  params,
  cities,
  fields,
  onNavigate,
  fieldsClassName,
  actionsClassName,
}: CatalogFilterFormProps) {
  const router = useRouter();
  const id = useId();
  const [priceMin, setPriceMin] = useState(priceInput(params.priceMin));
  const [priceMax, setPriceMax] = useState(priceInput(params.priceMax));
  const [cityId, setCityId] = useState(params.cityId ?? "");
  const [attributes, setAttributes] = useState<Record<string, string>>({ ...params.attributes });

  const attributeFields = params.subcategoryId ? (fields ?? []) : [];
  // Все карточки открыты по умолчанию.
  const [openCards, setOpenCards] = useState(() => [
    "price",
    "city",
    ...attributeFields.map((field) => `f.${field.key}`),
  ]);

  function setAttribute(key: string, value: string | undefined) {
    setAttributes((current) => {
      const next = { ...current };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  }

  // Значения формы в том виде, в каком они ушли бы в URL: пустое поле = параметра нет,
  // цена только цифрами, «от» больше «до» — меняются местами (как при разборе URL).
  const formFilters = normalizeFormFilters(priceMin, priceMax, cityId, attributes);
  const appliedFilters: CatalogFilters = {
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    cityId: params.cityId,
    attributes: params.attributes,
  };
  // «Показать» с теми же значениями ничего бы не изменило, а запрос ушёл бы.
  const changed = !sameFilters(formFilters, appliedFilters);
  // Сортировка фильтром не считается: её меняет селект в шапке списка.
  const canReset = hasCatalogFilters(formFilters) || hasCatalogFilters(appliedFilters);

  function navigate(next: CatalogParams) {
    router.push(buildCatalogHref(categoryId, next));
    onNavigate?.();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!changed) return;
    navigate({ ...params, ...formFilters, page: 1 });
  }

  function handleReset() {
    if (hasCatalogFilters(appliedFilters)) {
      navigate(resetCatalogFilters(params));
      return;
    }
    // В URL фильтров нет, изменена только форма: очищаем её без перехода.
    setPriceMin("");
    setPriceMax("");
    setCityId("");
    setAttributes({});
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" aria-label="Фильтры">
      <div className={cn("flex flex-col gap-4", fieldsClassName)}>
        <Accordion
          type="multiple"
          value={openCards}
          onValueChange={setOpenCards}
          className="flex flex-col gap-4"
        >
          <FilterCard value="price" title="Цена, ₸">
            <div className="grid grid-cols-2 gap-2">
              <PriceInput placeholder="от" aria-label="Цена от, ₸" value={priceMin} onChange={setPriceMin} />
              <PriceInput placeholder="до" aria-label="Цена до, ₸" value={priceMax} onChange={setPriceMax} />
            </div>
          </FilterCard>

          {cities && (
            <FilterCard value="city" title="Город">
              <FilterRadioList
                legend="Город"
                anyLabel="Все города"
                options={cities.map((city) => ({ value: city.id, label: city.name }))}
                value={cityId}
                onChange={setCityId}
              />
            </FilterCard>
          )}

          {attributeFields.map((field) => {
            const value = Object.hasOwn(attributes, field.key) ? attributes[field.key] : "";
            const fieldId = `${id}-f-${field.key}`;
            return (
              <FilterCard key={field.key} value={`f.${field.key}`} title={field.label}>
                {field.kind === "boolean" ? (
                  <div className="flex min-h-10 items-center gap-2">
                    <Checkbox
                      id={fieldId}
                      aria-label={field.label}
                      checked={value === BOOLEAN_TRUE}
                      onCheckedChange={(checked) =>
                        setAttribute(field.key, checked === true ? BOOLEAN_TRUE : undefined)
                      }
                    />
                    <Label htmlFor={fieldId} className="font-normal">
                      Да
                    </Label>
                  </div>
                ) : (
                  <FilterRadioList
                    legend={field.label}
                    anyLabel={field.anyLabel}
                    options={field.options}
                    value={value}
                    onChange={(next) => setAttribute(field.key, next || undefined)}
                  />
                )}
              </FilterCard>
            );
          })}
        </Accordion>

      </div>

      <div className={cn("flex flex-col gap-2 rounded-2xl bg-card p-4", actionsClassName)}>
        <Button
          type="submit"
          disabled={!changed}
          className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
        >
          Показать
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={!canReset}
          onClick={handleReset}
        >
          Сбросить
        </Button>
      </div>
    </form>
  );
}
