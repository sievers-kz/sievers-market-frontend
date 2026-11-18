"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { BOOLEAN_TRUE, type CityOption, type FilterField } from "./catalog-filter-fields";
import {
  buildCatalogHref,
  parsePrice,
  resetCatalogFilters,
  type CatalogParams,
} from "./search-params";

/** Radix Select не принимает пустое значение: «любое» — отдельный ключ. */
const ANY = "__any__";

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
  /** Классы обёртки полей и строки кнопок: в диалоге поля прокручиваются, кнопки снизу. */
  fieldsClassName?: string;
  actionsClassName?: string;
}

function priceInput(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "").slice(0, PRICE_MAX_DIGITS);
}

/**
 * Форма фильтров каталога: цена, город, атрибуты подкатегории. Значения живут в форме до
 * «Показать»: каждое применение это запрос на сервер и скелетон списка. Начальные значения
 * из URL; при смене URL форму пересоздаёт `key` у родителя.
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
      <div className={cn("flex flex-col gap-6", fieldsClassName)}>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Цена, ₸</legend>
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
        </fieldset>

        {cities && (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-city`}>Город</Label>
            <Select value={cityId || ANY} onValueChange={(value) => setCityId(value === ANY ? "" : value)}>
              <SelectTrigger id={`${id}-city`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value={ANY}>Все города</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {params.subcategoryId ? (
          fields?.map((field) => {
            const fieldId = `${id}-f-${field.key}`;
            const value = Object.hasOwn(attributes, field.key) ? attributes[field.key] : undefined;

            if (field.kind === "boolean") {
              return (
                <div key={field.key} className="flex min-h-10 items-center gap-2">
                  <Checkbox
                    id={fieldId}
                    checked={value === BOOLEAN_TRUE}
                    onCheckedChange={(checked) =>
                      setAttribute(field.key, checked === true ? BOOLEAN_TRUE : undefined)
                    }
                  />
                  <Label htmlFor={fieldId} className="font-normal">
                    {field.label}
                  </Label>
                </div>
              );
            }

            return (
              <div key={field.key} className="flex flex-col gap-2">
                <Label htmlFor={fieldId}>{field.label}</Label>
                <Select
                  value={value ?? ANY}
                  onValueChange={(next) => setAttribute(field.key, next === ANY ? undefined : next)}
                >
                  <SelectTrigger id={fieldId} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={ANY}>{field.anyLabel}</SelectItem>
                    {field.options.map((option) => (
                      // Образец внутри ItemText: Radix повторяет его и в выбранном значении.
                      <SelectItem key={option.value} value={option.value}>
                        {option.swatch && (
                          <span
                            aria-hidden
                            className="size-4 shrink-0 rounded-sm border border-foreground/20"
                            style={{ backgroundColor: option.swatch }}
                          />
                        )}
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            Выберите подкатегорию, чтобы увидеть фильтры по характеристикам
          </p>
        )}
      </div>

      <div className={cn("flex flex-col gap-2 pt-6", actionsClassName)}>
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
