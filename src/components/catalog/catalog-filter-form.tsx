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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { BOOLEAN_TRUE, type CityOption, type FilterField } from "./catalog-filter-fields";
import { FilterRadioList } from "./filter-radio-list";
import {
  buildCatalogHref,
  parsePrice,
  resetCatalogFilters,
  type CatalogParams,
} from "./search-params";

/** Не больше 15 цифр: такие числа точно безопасные целые. */
const PRICE_MAX_DIGITS = 15;

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

function priceInput(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "").slice(0, PRICE_MAX_DIGITS);
}

/** Карточка фильтра: белая, заголовок сворачивает и разворачивает содержимое. */
function FilterCard({ value, title, children }: { value: string; title: string; children: ReactNode }) {
  return (
    <AccordionItem value={value} className="rounded-2xl border-b-0 bg-card px-4 lg:px-6">
      <AccordionTrigger className="text-lg font-semibold hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
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

  function navigate(next: CatalogParams) {
    router.push(buildCatalogHref(categoryId, next));
    onNavigate?.();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let min = parsePrice(priceMin);
    let max = parsePrice(priceMax);
    if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
    navigate({
      ...params,
      priceMin: min,
      priceMax: max,
      cityId: cityId || undefined,
      attributes,
      page: 1,
    });
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
              <Input
                inputMode="numeric"
                autoComplete="off"
                placeholder="от"
                aria-label="Цена от, ₸"
                value={priceMin}
                onChange={(event) => setPriceMin(digitsOnly(event.target.value))}
              />
              <Input
                inputMode="numeric"
                autoComplete="off"
                placeholder="до"
                aria-label="Цена до, ₸"
                value={priceMax}
                onChange={(event) => setPriceMax(digitsOnly(event.target.value))}
              />
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

        {!params.subcategoryId && (
          <p className="rounded-2xl bg-card p-4 text-sm text-muted-foreground lg:px-6">
            Выберите подкатегорию, чтобы увидеть фильтры по характеристикам
          </p>
        )}
      </div>

      <div className={cn("flex flex-col gap-2 border-t bg-card p-4", actionsClassName)}>
        <Button type="submit" className="w-full bg-cta text-cta-foreground hover:bg-cta/90">
          Показать
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate(resetCatalogFilters(params))}
        >
          Сбросить
        </Button>
      </div>
    </form>
  );
}
