"use client";

import { useEffect } from "react";
import { useWatch, type Control } from "react-hook-form";

import type { ListingFormOutput, ListingFormValues } from "./listing-schema";
import { parsePreviewPrice, type ListingPreviewFields } from "./listing-preview-data";

interface ListingPreviewWatcherProps {
  control: Control<ListingFormValues, unknown, ListingFormOutput>;
  onChange: (fields: ListingPreviewFields) => void;
}

/**
 * Подписка на поля превью (атрибут `condition` есть не у каждой подкатегории). Отдельный компонент без разметки: ввод перерисовывает
 * только его, а не всю форму.
 */
export function ListingPreviewWatcher({ control, onChange }: ListingPreviewWatcherProps) {
  const [title, price, currency, cityId, conditionValue] = useWatch({
    control,
    name: ["title", "price", "currency", "city_id", "attributes.condition"],
  });
  const condition = typeof conditionValue === "string" && conditionValue ? conditionValue : null;

  useEffect(() => {
    onChange({ title: title.trim(), price: parsePreviewPrice(price), currency, cityId, condition });
  }, [title, price, currency, cityId, condition, onChange]);

  return null;
}
