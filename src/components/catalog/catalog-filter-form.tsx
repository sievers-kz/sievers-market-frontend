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

import {
  BOOLEAN_TRUE,
  filterFieldTitle,
  type CityOption,
  type FilterField,
} from "./catalog-filter-fields";
import { FilterRadioList } from "./filter-radio-list";
import { NumberInput } from "./number-input";
import {
  buildCatalogHref,
  hasCatalogFilters,
  orderRange,
  parsePrice,
  parseRangeBound,
  resetCatalogFilters,
  type CatalogFilters,
  type CatalogParams,
  type CatalogScope,
  type NumberRange,
} from "./search-params";

export interface CatalogFilterFormProps {
  scope: CatalogScope;
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

/** Поля «от» и «до» числового атрибута как в форме: цифры и точка, пустое = границы нет. */
interface RangeInput {
  min: string;
  max: string;
}

/** «12.» (дробь не дописана) считается как «12». */
function parseRangeInput(value: string): number | undefined {
  return parseRangeBound(value.replace(/\.$/, ""));
}

function normalizeFormFilters(
  priceMin: string,
  priceMax: string,
  cityId: string,
  attributes: Readonly<Record<string, string>>,
  rangeInputs: Readonly<Record<string, RangeInput>>,
): CatalogFilters {
  let min = parsePrice(priceMin);
  let max = parsePrice(priceMax);
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
  const ranges: Record<string, NumberRange> = {};
  for (const [key, input] of Object.entries(rangeInputs)) {
    const range = orderRange(parseRangeInput(input.min), parseRangeInput(input.max));
    if (range) ranges[key] = range;
  }
  return { priceMin: min, priceMax: max, cityId: cityId || undefined, attributes, ranges };
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

function sameRanges(a: CatalogFilters["ranges"] = {}, b: CatalogFilters["ranges"] = {}): boolean {
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => Object.hasOwn(b, key) && a[key].min === b[key].min && a[key].max === b[key].max)
  );
}

function sameFilters(a: CatalogFilters, b: CatalogFilters): boolean {
  return (
    a.priceMin === b.priceMin &&
    a.priceMax === b.priceMax &&
    a.cityId === b.cityId &&
    sameAttributes(a.attributes, b.attributes) &&
    sameRanges(a.ranges, b.ranges)
  );
}

function numberInput(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

function rangeInputs(ranges: CatalogFilters["ranges"] = {}): Record<string, RangeInput> {
  return Object.fromEntries(
    Object.entries(ranges).map(([key, { min, max }]) => [key, { min: numberInput(min), max: numberInput(max) }]),
  );
}

/**
 * Карточка фильтра, как карточка «Категории» (`SubcategoryNav`): белая, `p-4`, заголовок
 * `text-lg font-semibold` с `px-2` и отступом 8 до содержимого. Содержимое тоже с `px-2`,
 * чтобы левый край текста совпадал во всех карточках сайдбара.
 */
function FilterCard({ value, title, children }: { value: string; title: string; children: ReactNode }) {
  return (
    <AccordionItem value={value} className="rounded-2xl border-b-0 bg-card p-4">
      <AccordionTrigger className="items-center px-2 py-0 text-lg font-semibold hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="px-2 pt-2 pb-0">{children}</AccordionContent>
    </AccordionItem>
  );
}

/**
 * Форма фильтров каталога: цена, город, атрибуты подкатегории (выбор, галочка, диапазон
 * «от–до»), каждый в своей карточке.
 * Значения живут в форме до «Показать»: каждое применение это запрос на сервер и скелетон
 * списка. Начальные значения из URL; при смене URL форму пересоздаёт `key` у родителя.
 */
export function CatalogFilterForm({
  scope,
  params,
  cities,
  fields,
  onNavigate,
  fieldsClassName,
  actionsClassName,
}: CatalogFilterFormProps) {
  const router = useRouter();
  const id = useId();
  const [priceMin, setPriceMin] = useState(numberInput(params.priceMin));
  const [priceMax, setPriceMax] = useState(numberInput(params.priceMax));
  const [cityId, setCityId] = useState(params.cityId ?? "");
  const [attributes, setAttributes] = useState<Record<string, string>>({ ...params.attributes });
  const [ranges, setRanges] = useState<Record<string, RangeInput>>(() => rangeInputs(params.ranges));

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

  function setRangeBound(key: string, bound: keyof RangeInput, value: string) {
    setRanges((current) => {
      const previous = Object.hasOwn(current, key) ? current[key] : { min: "", max: "" };
      const range = { ...previous, [bound]: value };
      const next = { ...current };
      if (range.min || range.max) next[key] = range;
      else delete next[key];
      return next;
    });
  }

  // Значения формы в том виде, в каком они ушли бы в URL: пустое поле = параметра нет,
  // цена и диапазоны числами, «от» больше «до» — меняются местами (как при разборе URL).
  const formFilters = normalizeFormFilters(priceMin, priceMax, cityId, attributes, ranges);
  const appliedFilters: CatalogFilters = {
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    cityId: params.cityId,
    attributes: params.attributes,
    ranges: params.ranges,
  };
  // «Показать» с теми же значениями ничего бы не изменило, а запрос ушёл бы.
  const changed = !sameFilters(formFilters, appliedFilters);
  // Сортировка фильтром не считается: её меняет селект в шапке списка.
  const canReset = hasCatalogFilters(formFilters) || hasCatalogFilters(appliedFilters);

  function navigate(next: CatalogParams) {
    router.push(buildCatalogHref(scope, next));
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
    setRanges({});
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
              <NumberInput placeholder="от" aria-label="Цена от, ₸" value={priceMin} onChange={setPriceMin} />
              <NumberInput placeholder="до" aria-label="Цена до, ₸" value={priceMax} onChange={setPriceMax} />
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
            const range = Object.hasOwn(ranges, field.key) ? ranges[field.key] : { min: "", max: "" };
            const fieldId = `${id}-f-${field.key}`;
            const title = filterFieldTitle(field);
            return (
              <FilterCard key={field.key} value={`f.${field.key}`} title={title}>
                {field.kind === "range" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput
                      placeholder="от"
                      aria-label={`${title}: от`}
                      decimal={field.decimal}
                      groupFrom={5}
                      value={range.min}
                      onChange={(next) => setRangeBound(field.key, "min", next)}
                    />
                    <NumberInput
                      placeholder="до"
                      aria-label={`${title}: до`}
                      decimal={field.decimal}
                      groupFrom={5}
                      value={range.max}
                      onChange={(next) => setRangeBound(field.key, "max", next)}
                    />
                  </div>
                ) : field.kind === "boolean" ? (
                  <div className="flex min-h-10 items-center gap-2 px-2">
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
